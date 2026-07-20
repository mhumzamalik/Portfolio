import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import {
  isVerifiedTwoFactorSession,
  clearVerifiedTwoFactorCookie,
  clearPendingTwoFactorCookie,
} from "@/lib/security/two-factor-session";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy": "frame-ancestors 'none'",
};

function applySecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

function redirectWithCookies(
  url: URL,
  supabaseResponse: NextResponse
): NextResponse {
  const redirectResponse = NextResponse.redirect(url);
  
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie.name, cookie.value, {
      path: cookie.path,
      domain: cookie.domain,
      expires: cookie.expires,
      maxAge: cookie.maxAge,
      secure: cookie.secure,
      httpOnly: cookie.httpOnly,
      sameSite: cookie.sameSite,
    });
  });

  return applySecurityHeaders(redirectResponse);
}

export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  let supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          
          const cookieStrings = request.cookies.getAll().map(
            (c) => `${c.name}=${c.value}`
          );
          requestHeaders.set("Cookie", cookieStrings.join("; "));

          supabaseResponse = NextResponse.next({
            request: {
              headers: requestHeaders,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const isAdminRoute =
    request.nextUrl.pathname.startsWith("/admin") ||
    request.nextUrl.pathname.startsWith("/dashboard");
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  if (isAdminRoute) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      const errorMsg = error.message?.toLowerCase() || "";
      const isRefreshTokenError =
        error.status === 400 ||
        errorMsg.includes("refresh_token") ||
        errorMsg.includes("invalid_grant");

      if (isRefreshTokenError) {
        // Clear all cookies starting with 'sb-' or containing 'auth-token'
        const allCookies = request.cookies.getAll();
        allCookies.forEach((cookie) => {
          if (cookie.name.startsWith("sb-") || cookie.name.includes("auth-token")) {
            supabaseResponse.cookies.set(cookie.name, "", { maxAge: 0, path: "/" });
            request.cookies.delete(cookie.name);
          }
        });

        // Also clear 2FA session cookies to keep everything in sync
        clearVerifiedTwoFactorCookie(supabaseResponse);
        clearPendingTwoFactorCookie(supabaseResponse);
      }
    }

    if (!user) {
      if (!isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return redirectWithCookies(url, supabaseResponse);
      }
    } else {
      const is2faVerified = await isVerifiedTwoFactorSession(request);
      if (is2faVerified) {
        if (isLoginPage) {
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          return redirectWithCookies(url, supabaseResponse);
        }
      } else {
        if (!isLoginPage) {
          const url = request.nextUrl.clone();
          url.pathname = "/admin/login";
          return redirectWithCookies(url, supabaseResponse);
        }
      }
    }
  }

  return applySecurityHeaders(supabaseResponse);
}

