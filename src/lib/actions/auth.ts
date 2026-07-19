"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginWithCaptchaSchema } from "@/lib/validations/auth";
import { verifyRecaptcha } from "@/lib/security/recaptcha";
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  formatRemainingTime,
} from "@/lib/security/rate-limit";
import { prisma } from "@/lib/prisma";
import {
  setPendingTwoFactorActionCookie,
  setVerifiedTwoFactorActionCookie,
  clearVerifiedTwoFactorActionCookie,
  clearPendingTwoFactorActionCookie,
  readPendingTwoFactorEmailAction,
} from "@/lib/security/two-factor-session";

async function getClientIp(): Promise<string> {
  const headerStore = await headers();

  const forwarded = headerStore.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = headerStore.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

export type LoginActionResult =
  | { error: string }
  | { requiresTwoFactor: true; email: string }
  | void;

export async function loginAction(
  formData: { email: string; password: string },
  recaptchaToken: string
): Promise<LoginActionResult> {
  const parsed = loginWithCaptchaSchema.safeParse({
    ...formData,
    recaptchaToken,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { email, password } = parsed.data;

  const ip = await getClientIp();

  const rateLimitResult = checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    const waitTime = formatRemainingTime(rateLimitResult.remainingMs ?? 0);
    return {
      error: `Too many failed login attempts. Please wait ${waitTime} before trying again.`,
    };
  }

  const captchaResult = await verifyRecaptcha(recaptchaToken);

  if (!captchaResult.success) {
    return {
      error: "Security verification failed. Please refresh and try again.",
    };
  }

  const supabase = await createClient();

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) {
    recordFailedAttempt(ip);
    return { error: "Invalid email or password. Please try again." };
  }

  const adminUser = await prisma.adminUser.findUnique({
    where: { email },
    select: { role: true, twoFactorEnabled: true },
  });

  if (!adminUser || (adminUser.role !== "Admin" && adminUser.role !== "ADMIN")) {
    await supabase.auth.signOut();
    return { error: "Access denied. Unauthorized role." };
  }

  if (adminUser.twoFactorEnabled) {
    await setPendingTwoFactorActionCookie(email);
    await clearVerifiedTwoFactorActionCookie();
    return { requiresTwoFactor: true, email };
  }

  await setVerifiedTwoFactorActionCookie(email);
  await clearPendingTwoFactorActionCookie();

  resetRateLimit(ip);

  redirect("/admin");
}

export async function loginActionAfterTotp(ip: string): Promise<void> {
  resetRateLimit(ip);
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  await clearVerifiedTwoFactorActionCookie();
  await clearPendingTwoFactorActionCookie();
  redirect("/admin/login");
}

export async function checkPending2faAction(): Promise<string | null> {
  return await readPendingTwoFactorEmailAction();
}
