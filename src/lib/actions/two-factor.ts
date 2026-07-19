"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  generateTotpSecret,
  generateTotpUri,
  generateQrCodeDataUrl,
  verifyTotpToken,
} from "@/lib/security/totp";
import {
  checkRateLimit,
  recordFailedAttempt,
} from "@/lib/security/rate-limit";
import { encrypt, decrypt } from "@/lib/security/encryption";
import crypto from "crypto";
import {
  clearPendingTwoFactorActionCookie,
  setVerifiedTwoFactorActionCookie,
} from "@/lib/security/two-factor-session";

async function getClientIp(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = headerStore.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

async function getAuthenticatedAdminUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const adminUser = await prisma.adminUser.findUnique({
    where: { authUserId: user.id },
  });

  return adminUser;
}

function getDecryptedSecret(encryptedOrPlainSecret: string | null): string | null {
  if (!encryptedOrPlainSecret) return null;
  if (!encryptedOrPlainSecret.includes(":")) {
    return encryptedOrPlainSecret;
  }
  try {
    return decrypt(encryptedOrPlainSecret);
  } catch (e) {
    console.error("Failed to decrypt 2FA secret, using raw:", e);
    return encryptedOrPlainSecret;
  }
}

export interface TwoFactorSetupData {
  secret: string;
  qrCodeDataUrl: string;
}

export interface TwoFactorActionResult {
  success?: boolean;
  error?: string;
  data?: TwoFactorSetupData;
  backupCodes?: string[];
}

export async function generateSetupDataAction(): Promise<TwoFactorActionResult> {
  const adminUser = await getAuthenticatedAdminUser();
  if (!adminUser) return { error: "Unauthorized." };

  if (adminUser.twoFactorEnabled) {
    return { error: "Two-factor authentication is already enabled." };
  }

  const secret = generateTotpSecret();
  const uri = generateTotpUri(secret, adminUser.email);
  const qrCodeDataUrl = await generateQrCodeDataUrl(uri);

  const encryptedSecret = encrypt(secret);

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { twoFactorSecret: encryptedSecret },
  });

  return { success: true, data: { secret, qrCodeDataUrl } };
}

export async function enableTwoFactorAction(
  token: string
): Promise<TwoFactorActionResult> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(`2fa_enable_${ip}`);
  if (!rateLimitResult.allowed) {
    return { error: "Too many attempts. Please wait before trying again." };
  }

  const adminUser = await getAuthenticatedAdminUser();
  if (!adminUser) return { error: "Unauthorized." };

  if (!adminUser.twoFactorSecret) {
    return { error: "No setup in progress. Please generate a QR code first." };
  }

  const decryptedSecret = getDecryptedSecret(adminUser.twoFactorSecret);
  if (!decryptedSecret) {
    return { error: "Invalid configuration secret." };
  }

  const isValid = verifyTotpToken(decryptedSecret, token);

  if (!isValid) {
    recordFailedAttempt(`2fa_enable_${ip}`);
    return { error: "Invalid authentication code. Please try again." };
  }

  const plainBackupCodes = Array.from({ length: 8 }, () =>
    crypto.randomBytes(5).toString("hex").toUpperCase()
  );
  const encryptedBackupCodes = plainBackupCodes.map((code) => encrypt(code));

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: {
      twoFactorEnabled: true,
      twoFactorVerifiedAt: new Date(),
      backupCodes: encryptedBackupCodes,
    },
  });

  return { success: true, backupCodes: plainBackupCodes };
}

export async function disableTwoFactorAction(
  token: string
): Promise<TwoFactorActionResult> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(`2fa_disable_${ip}`);
  if (!rateLimitResult.allowed) {
    return { error: "Too many attempts. Please wait before trying again." };
  }

  const adminUser = await getAuthenticatedAdminUser();
  if (!adminUser) return { error: "Unauthorized." };

  if (!adminUser.twoFactorEnabled || !adminUser.twoFactorSecret) {
    return { error: "Two-factor authentication is not enabled." };
  }

  const decryptedSecret = getDecryptedSecret(adminUser.twoFactorSecret);
  if (!decryptedSecret) {
    return { error: "Invalid configuration secret." };
  }

  const isValid = verifyTotpToken(decryptedSecret, token);

  if (!isValid) {
    recordFailedAttempt(`2fa_disable_${ip}`);
    return { error: "Invalid authentication code. Please try again." };
  }

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: {
      twoFactorEnabled: false,
      twoFactorSecret: null,
      twoFactorVerifiedAt: null,
      backupCodes: [],
    },
  });

  return { success: true };
}

export async function verifyTotpAction(
  token: string,
  email: string
): Promise<TwoFactorActionResult> {
  const ip = await getClientIp();
  const rateLimitResult = checkRateLimit(`2fa_verify_${ip}`);
  if (!rateLimitResult.allowed) {
    return { error: "Too many attempts. Please wait before trying again." };
  }

  const adminUser = await prisma.adminUser.findUnique({ where: { email } });

  if (!adminUser || !adminUser.twoFactorEnabled || !adminUser.twoFactorSecret) {
    return { error: "Two-factor authentication is not configured." };
  }

  let isValid = false;

  const decryptedSecret = getDecryptedSecret(adminUser.twoFactorSecret);
  if (decryptedSecret) {
    isValid = verifyTotpToken(decryptedSecret, token);
  }

  if (!isValid && adminUser.backupCodes && adminUser.backupCodes.length > 0) {
    const matchedIndex = adminUser.backupCodes.findIndex((encryptedCode) => {
      try {
        const plainCode = decrypt(encryptedCode);
        return plainCode.toUpperCase() === token.trim().toUpperCase();
      } catch {
        return false;
      }
    });

    if (matchedIndex !== -1) {
      isValid = true;
      const updatedBackupCodes = [...adminUser.backupCodes];
      updatedBackupCodes.splice(matchedIndex, 1);

      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { backupCodes: updatedBackupCodes },
      });
    }
  }

  if (!isValid) {
    recordFailedAttempt(`2fa_verify_${ip}`);
    return { error: "Invalid or expired code. Please try again." };
  }

  await prisma.adminUser.update({
    where: { id: adminUser.id },
    data: { twoFactorVerifiedAt: new Date() },
  });

  await setVerifiedTwoFactorActionCookie(email);
  await clearPendingTwoFactorActionCookie();

  return { success: true };
}
