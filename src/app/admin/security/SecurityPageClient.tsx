"use client";

import { useState } from "react";
import {
  ShieldCheck,
  ShieldOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  QrCode,
  KeyRound,
} from "lucide-react";
import {
  generateSetupDataAction,
  enableTwoFactorAction,
  disableTwoFactorAction,
} from "@/lib/actions/two-factor";
import Image from "next/image";

interface SecurityPageClientProps {
  isEnabled: boolean;
  verifiedAt: string | null;
}

export default function SecurityPageClient({
  isEnabled,
  verifiedAt,
}: SecurityPageClientProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(isEnabled);
  const [verifiedDate, setVerifiedDate] = useState(verifiedAt);

  const [setupPhase, setSetupPhase] = useState<"idle" | "setup" | "confirm">(
    "idle"
  );
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [manualSecret, setManualSecret] = useState("");
  const [enableToken, setEnableToken] = useState("");
  const [disableToken, setDisableToken] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const clearMessages = () => {
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleGenerateSetup = async () => {
    setIsLoading(true);
    clearMessages();

    const result = await generateSetupDataAction();

    if (result.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
      return;
    }

    if (result.data) {
      setQrCodeDataUrl(result.data.qrCodeDataUrl);
      setManualSecret(result.data.secret);
      setSetupPhase("setup");
    }

    setIsLoading(false);
  };

  const handleEnable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enableToken.trim()) return;

    setIsLoading(true);
    clearMessages();

    const result = await enableTwoFactorAction(enableToken.trim());

    if (result.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
      return;
    }

    setTwoFactorEnabled(true);
    setVerifiedDate(new Date().toISOString());
    setSetupPhase("idle");
    setQrCodeDataUrl("");
    setManualSecret("");
    setEnableToken("");
    if (result.backupCodes) {
      setBackupCodes(result.backupCodes);
    }
    setSuccessMessage(
      "Two-factor authentication has been successfully enabled."
    );
    setIsLoading(false);
  };

  const handleDisable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disableToken.trim()) return;

    setIsLoading(true);
    clearMessages();

    const result = await disableTwoFactorAction(disableToken.trim());

    if (result.error) {
      setErrorMessage(result.error);
      setIsLoading(false);
      return;
    }

    setTwoFactorEnabled(false);
    setVerifiedDate(null);
    setDisableToken("");
    setSuccessMessage("Two-factor authentication has been disabled.");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="serif-title text-2xl text-foreground font-semibold">
          Security Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-1 font-sans">
          Manage two-factor authentication for your admin account.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 text-emerald-500 text-xs rounded-xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 bg-rose-500/10 text-rose-400 text-xs rounded-xl border border-rose-400/20">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {backupCodes.length > 0 && (
        <div className="premium-panel p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-emerald-500 font-semibold text-xs uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Save Your Recovery Codes</span>
          </div>
          <p className="text-[11px] text-muted-foreground font-sans leading-relaxed">
            If you lose access to your authenticator app, you can use these recovery codes to sign in. Each code can only be used once. Keep them in a safe, offline place.
          </p>
          <div className="grid grid-cols-2 gap-2 max-w-sm pt-2">
            {backupCodes.map((code) => (
              <div key={code} className="p-2.5 bg-muted/40 border border-border rounded-xl text-center">
                <code className="text-xs font-mono text-foreground font-semibold tracking-wider">{code}</code>
              </div>
            ))}
          </div>
          <button
            onClick={() => setBackupCodes([])}
            className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground hover:text-foreground transition pt-2"
          >
            I have saved these codes
          </button>
        </div>
      )}

      <div className="premium-panel p-6 rounded-2xl border border-border/80 bg-card/50 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 border rounded-xl ${twoFactorEnabled ? "border-emerald-500/20 bg-emerald-500/5" : "border-border bg-muted/40"}`}
            >
              {twoFactorEnabled ? (
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              ) : (
                <ShieldOff className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div>
              <h2 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Google Authenticator (TOTP)
              </h2>
              <p className="text-[10px] text-muted-foreground mt-0.5 font-sans">
                {twoFactorEnabled
                  ? `Enabled${verifiedDate ? ` · ${new Date(verifiedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}`
                  : "Not configured"}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] uppercase font-semibold border ${
              twoFactorEnabled
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {twoFactorEnabled ? "Active" : "Inactive"}
          </span>
        </div>

        {!twoFactorEnabled && setupPhase === "idle" && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground font-sans leading-relaxed">
              Add an extra layer of security to your account. You will be asked
              for a 6-digit code from your authenticator app each time you sign
              in.
            </p>
            <button
              onClick={handleGenerateSetup}
              disabled={isLoading}
              className="premium-button-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold disabled:opacity-50 transition duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <QrCode className="w-3.5 h-3.5" />
              )}
              <span>Set Up 2FA</span>
            </button>
          </div>
        )}

        {!twoFactorEnabled && setupPhase === "setup" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Step 1 — Scan this QR code
              </p>
              <p className="text-[11px] text-muted-foreground font-sans">
                Open Google Authenticator (or any TOTP app), tap the{" "}
                <strong>+</strong> button, and scan the code below.
              </p>
              {qrCodeDataUrl && (
                <div className="flex justify-center pt-2">
                  <div className="p-3 bg-white rounded-xl border border-border inline-block">
                    <Image
                      src={qrCodeDataUrl}
                      alt="2FA QR Code"
                      width={200}
                      height={200}
                      unoptimized
                    />
                  </div>
                </div>
              )}
            </div>

            {manualSecret && (
              <div className="space-y-1.5">
                <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                  Manual entry key
                </p>
                <div className="flex items-center gap-2 p-3 bg-muted/40 border border-border rounded-xl">
                  <KeyRound className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                  <code className="text-xs font-mono text-foreground tracking-widest break-all">
                    {manualSecret}
                  </code>
                </div>
              </div>
            )}

            <form onSubmit={handleEnable} className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-foreground">
                  Step 2 — Confirm with a code
                </p>
                <label
                  htmlFor="enable-token"
                  className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider"
                >
                  Authentication Code
                </label>
                <input
                  id="enable-token"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={enableToken}
                  onChange={(e) =>
                    setEnableToken(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="000000"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition text-center tracking-[0.5em] font-mono"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading || enableToken.length !== 6}
                  className="premium-button-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold disabled:opacity-50 transition duration-300"
                >
                  {isLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Activate 2FA</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSetupPhase("idle");
                    setQrCodeDataUrl("");
                    setManualSecret("");
                    setEnableToken("");
                    clearMessages();
                  }}
                  className="px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold text-muted-foreground border border-border hover:bg-muted transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {twoFactorEnabled && (
          <form onSubmit={handleDisable} className="space-y-4">
            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl">
              <p className="text-[11px] text-amber-500 font-sans leading-relaxed">
                <strong>Warning:</strong> Disabling 2FA will remove the
                additional security layer from your account. Enter your current
                authenticator code to confirm.
              </p>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="disable-token"
                className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider"
              >
                Authentication Code to Confirm
              </label>
              <input
                id="disable-token"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                value={disableToken}
                onChange={(e) =>
                  setDisableToken(
                    e.target.value.replace(/\D/g, "").slice(0, 6)
                  )
                }
                placeholder="000000"
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary/50 transition text-center tracking-[0.5em] font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || disableToken.length !== 6}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold text-rose-500 border border-rose-500/30 hover:bg-rose-500/10 disabled:opacity-50 transition duration-300"
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ShieldOff className="w-3.5 h-3.5" />
              )}
              <span>Disable 2FA</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
