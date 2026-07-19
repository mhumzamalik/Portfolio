import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_PENDING = "admin-2fa-pending";
const COOKIE_VERIFIED = "admin-2fa-verified";
const PENDING_TTL_MS = 5 * 60 * 1000;
const VERIFIED_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const ENCRYPTION_KEY = process.env.TOTP_ENCRYPTION_KEY || "default-dev-totp-encryption-key-please-change-it-now";

function base64Encode(str: string): string {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => {
      return String.fromCharCode(parseInt(p1, 16));
    })
  );
}

function base64Decode(str: string): string {
  return decodeURIComponent(
    Array.prototype.map
      .call(atob(str), (c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}

async function getCryptoKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyData = enc.encode(ENCRYPTION_KEY);
  return crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign", "verify"]
  );
}

async function signToken(payload: any): Promise<string> {
  const enc = new TextEncoder();
  const dataStr = JSON.stringify(payload);
  const key = await getCryptoKey();
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(dataStr));
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return base64Encode(JSON.stringify({ data: dataStr, sig: sigHex }));
}

async function verifyToken(token: string): Promise<any | null> {
  try {
    const rawJson = base64Decode(token);
    const { data, sig } = JSON.parse(rawJson);

    const enc = new TextEncoder();
    const key = await getCryptoKey();
    const expectedSigBuffer = await crypto.subtle.sign(
      "HMAC",
      key,
      enc.encode(data)
    );
    const expectedSig = Array.from(new Uint8Array(expectedSigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    if (sig !== expectedSig) return null;
    return JSON.parse(data);
  } catch {
    return null;
  }
}

interface PendingPayload {
  email: string;
  exp: number;
}

export function setPendingTwoFactorCookie(
  response: NextResponse,
  email: string
): void {
  const payload: PendingPayload = {
    email,
    exp: Date.now() + PENDING_TTL_MS,
  };

  response.cookies.set(COOKIE_PENDING, JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(PENDING_TTL_MS / 1000),
    path: "/",
  });
}

export function clearPendingTwoFactorCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_PENDING, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export function readPendingTwoFactorEmail(
  request: NextRequest
): string | null {
  const raw = request.cookies.get(COOKIE_PENDING)?.value;
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as PendingPayload;
    if (Date.now() > payload.exp) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export async function setVerifiedTwoFactorCookie(
  response: NextResponse,
  email: string
): Promise<void> {
  const payload = {
    email,
    exp: Date.now() + VERIFIED_TTL_MS,
  };

  const token = await signToken(payload);

  response.cookies.set(COOKIE_VERIFIED, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(VERIFIED_TTL_MS / 1000),
    path: "/",
  });
}

export function clearVerifiedTwoFactorCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_VERIFIED, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function isVerifiedTwoFactorSession(
  request: NextRequest
): Promise<boolean> {
  const token = request.cookies.get(COOKIE_VERIFIED)?.value;
  if (!token) return false;

  const payload = await verifyToken(token);
  if (!payload) return false;

  if (Date.now() > payload.exp) return false;
  return true;
}

// Server Action-friendly methods using next/headers cookies API
export async function setPendingTwoFactorActionCookie(email: string): Promise<void> {
  const payload: PendingPayload = {
    email,
    exp: Date.now() + PENDING_TTL_MS,
  };

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_PENDING, JSON.stringify(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(PENDING_TTL_MS / 1000),
    path: "/",
  });
}

export async function clearPendingTwoFactorActionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_PENDING, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function readPendingTwoFactorEmailAction(): Promise<string | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_PENDING)?.value;
  if (!raw) return null;

  try {
    const payload = JSON.parse(raw) as PendingPayload;
    if (Date.now() > payload.exp) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export async function setVerifiedTwoFactorActionCookie(email: string): Promise<void> {
  const payload = {
    email,
    exp: Date.now() + VERIFIED_TTL_MS,
  };

  const token = await signToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_VERIFIED, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: Math.floor(VERIFIED_TTL_MS / 1000),
    path: "/",
  });
}

export async function clearVerifiedTwoFactorActionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_VERIFIED, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function isVerifiedTwoFactorSessionAction(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_VERIFIED)?.value;
  if (!token) return false;

  const payload = await verifyToken(token);
  if (!payload) return false;

  if (Date.now() > payload.exp) return false;
  return true;
}
