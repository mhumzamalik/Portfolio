import {
  generateSecret,
  generateURI,
  verifySync,
} from "otplib";
import type { OTPVerifyOptions } from "otplib";
import QRCode from "qrcode";

const ISSUER = process.env.TOTP_ISSUER ?? "Admin Portal";

export function generateTotpSecret(): string {
  return generateSecret();
}

export function generateTotpUri(secret: string, email: string): string {
  return generateURI({
    issuer: ISSUER,
    label: email,
    secret,
  });
}

export async function generateQrCodeDataUrl(
  otpauthUri: string
): Promise<string> {
  return QRCode.toDataURL(otpauthUri, {
    width: 200,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

export function verifyTotpToken(secret: string, token: string): boolean {
  try {
    const opts: OTPVerifyOptions = {
      secret,
      token: token.trim(),
      epochTolerance: 60,
    };
    const result = verifySync(opts);
    return result.valid;
  } catch {
    return false;
  }
}
