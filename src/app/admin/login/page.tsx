"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail, AlertCircle, ShieldCheck } from "lucide-react";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { loginAction, checkPending2faAction } from "@/lib/actions/auth";
import { verifyTotpAction } from "@/lib/actions/two-factor";

function isNextRedirect(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    (err as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string }
      ) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const RECAPTCHA_ACTION = "admin_login";

type Step = "credentials" | "otp";

export default function AdminLoginPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [pendingEmail, setPendingEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const recaptchaReady = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn("[reCAPTCHA] NEXT_PUBLIC_RECAPTCHA_SITE_KEY is not set.");
      return;
    }

    if (document.getElementById("recaptcha-script")) {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
          recaptchaReady.current = true;
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = "recaptcha-script";
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => {
        recaptchaReady.current = true;
      });
    };
    document.head.appendChild(script);

    // Clean up script and badge when login page unmounts (e.g. after successful login)
    return () => {
      recaptchaReady.current = false;
      const injected = document.getElementById("recaptcha-script");
      if (injected) injected.remove();
      // Google injects a badge iframe into body; remove it to avoid leaking it
      // into authenticated dashboard pages.
      const badge = document.querySelector(".grecaptcha-badge");
      if (badge && badge.parentElement) badge.parentElement.remove();
    };
  }, []);

  useEffect(() => {
    const checkPendingStatus = async () => {
      try {
        const email = await checkPending2faAction();
        if (email) {
          setPendingEmail(email);
          setStep("otp");
        }
      } catch (err) {
        console.error("[Login] Failed to check pending 2FA:", err);
      }
    };
    checkPendingStatus();
  }, []);

  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (!RECAPTCHA_SITE_KEY) {
      return "";
    }

    return new Promise<string>((resolve, reject) => {
      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, {
            action: RECAPTCHA_ACTION,
          });
          resolve(token);
        } catch (err) {
          reject(err);
        }
      });
    });
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError("");

    try {
      const token = await getRecaptchaToken();
      const result = await loginAction(data, token);

      if (!result) return;

      if ("error" in result) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if ("requiresTwoFactor" in result && result.requiresTwoFactor) {
        setPendingEmail(result.email);
        setStep("otp");
        setIsLoading(false);
        return;
      }
    } catch (err) {
      if (isNextRedirect(err)) throw err;
      console.error("[Login] Unexpected error:", err);
      setError("Something went wrong. Please try again later.");
      setIsLoading(false);
    }
  };

  const onOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpValue.trim()) {
      setError("Please enter your 6-digit authentication code.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await verifyTotpAction(otpValue.trim(), pendingEmail);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      window.location.href = "/admin";
    } catch (err) {
      if (isNextRedirect(err)) throw err;
      console.error("[OTP] Unexpected error:", err);
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-10">
          <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary/10 border border-border flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-primary" />
          </div>
          <h1 className="serif-title text-3xl text-foreground tracking-tight">
            Two-Factor Auth
          </h1>
          <p className="text-xs text-muted-foreground mt-2 font-sans">
            Enter the 6-digit code from your authenticator app
          </p>
        </div>

        <div className="premium-panel p-8 rounded-2xl">
          {error && (
            <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 text-rose-400 text-xs rounded-xl border border-rose-400/20">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={onOtpSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="otp"
                className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider"
              >
                Authentication Code
              </label>
              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={otpValue}
                onChange={(e) =>
                  setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="000000"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition text-center tracking-[0.5em] font-mono"
                autoFocus
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otpValue.length !== 6}
              className="premium-button-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold disabled:opacity-50 transition duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Verify</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setError("");
                setOtpValue("");
              }}
              className="w-full text-center text-[10px] text-muted-foreground hover:text-foreground transition mt-2"
            >
              ← Back to sign in
            </button>
          </form>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-8 font-sans">
          Protected area &middot; Authorized personnel only
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-6">
      <div className="text-center mb-10">
        <div className="w-12 h-12 mx-auto mb-4 rounded-2xl bg-primary/10 border border-border flex items-center justify-center">
          <Lock className="w-5 h-5 text-primary" />
        </div>
        <h1 className="serif-title text-3xl text-foreground tracking-tight">
          Admin Portal
        </h1>
        <p className="text-xs text-muted-foreground mt-2 font-sans">
          Sign in to access the dashboard
        </p>
      </div>

      <div className="premium-panel p-8 rounded-2xl">
        {error && (
          <div className="flex items-center gap-3 p-4 mb-6 bg-rose-500/10 text-rose-400 text-xs rounded-xl border border-rose-400/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="email"
                type="email"
                {...register("email")}
                placeholder="admin@example.com"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <span className="text-[10px] text-red-500">
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                id="password"
                type="password"
                {...register("password")}
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition"
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <span className="text-[10px] text-red-500">
                {errors.password.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="premium-button-primary w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs uppercase tracking-widest font-semibold disabled:opacity-50 transition duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-[10px] text-muted-foreground mt-8 font-sans">
        Protected area &middot; Authorized personnel only
      </p>
      <p className="text-center text-[9px] text-muted-foreground/50 mt-2 font-sans">
        Protected by reCAPTCHA &middot;{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-muted-foreground transition"
        >
          Privacy
        </a>{" "}
        &middot;{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-muted-foreground transition"
        >
          Terms
        </a>
      </p>
    </div>
  );
}
