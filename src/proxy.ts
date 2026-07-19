import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { detectBot } from "@/lib/security/bot-detection";

interface RateLimitEntry {
  count: number;
  firstRequest: number;
}

const ADMIN_PAGE_RATE = {
  maxRequests: 60,
  windowMs: 10 * 60 * 1000,
} as const;

const pageRateLimitStore = new Map<string, RateLimitEntry>();

function getIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function normalizeIp(ip: string): string {
  return ip.replace(/^::ffff:/i, "").trim();
}

function checkPageRateLimit(rawIp: string): boolean {
  const ip = normalizeIp(rawIp);
  const now = Date.now();

  const entry = pageRateLimitStore.get(ip);

  if (!entry || now - entry.firstRequest >= ADMIN_PAGE_RATE.windowMs) {
    pageRateLimitStore.set(ip, { count: 1, firstRequest: now });
    return true;
  }

  if (entry.count >= ADMIN_PAGE_RATE.maxRequests) {
    return false;
  }

  pageRateLimitStore.set(ip, { ...entry, count: entry.count + 1 });
  return true;
}

function tooManyRequestsResponse(): NextResponse {
  return new NextResponse(
    JSON.stringify({
      error: "Too many requests. Please try again later.",
    }),
    {
      status: 429,
      headers: { "Content-Type": "application/json" },
    }
  );
}

function forbiddenResponse(): NextResponse {
  return new NextResponse(
    JSON.stringify({ error: "Access denied." }),
    {
      status: 403,
      headers: { "Content-Type": "application/json" },
    }
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/dashboard");

  if (isAdminRoute) {
    const userAgent = request.headers.get("user-agent");
    const botResult = detectBot(userAgent);

    if (botResult.isBot) {
      return forbiddenResponse();
    }

    const ip = getIp(request);
    const allowed = checkPageRateLimit(ip);

    if (!allowed) {
      return tooManyRequestsResponse();
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
