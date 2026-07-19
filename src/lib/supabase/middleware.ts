import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isVerifiedTwoFactorSession } from "@/lib/security/two-factor-session";

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
    } = await supabase.auth.getUser();

    if (!user) {
      if (!isLoginPage) {
        const url = request.nextUrl.clone();
        url.pathname = "/admin/login";
        return applySecurityHeaders(NextResponse.redirect(url));
      }
    } else {
      const is2faVerified = await isVerifiedTwoFactorSession(request);
      if (is2faVerified) {
        if (isLoginPage) {
          const url = request.nextUrl.clone();
          url.pathname = "/admin";
          return applySecurityHeaders(NextResponse.redirect(url));
        }
      } else {
        if (!isLoginPage) {
          const url = request.nextUrl.clone();
          url.pathname = "/admin/login";
          return applySecurityHeaders(NextResponse.redirect(url));
        }
      }
    }
  }

  return applySecurityHeaders(supabaseResponse);
}

