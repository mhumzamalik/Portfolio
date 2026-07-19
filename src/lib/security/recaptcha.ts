
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

const SCORE_THRESHOLD = 0.5;

const EXPECTED_ACTION = "admin_login";

export interface RecaptchaVerifyResult {
  success: boolean;
  score?: number;
  error?: string;
}

export async function verifyRecaptcha(
  token: string
): Promise<RecaptchaVerifyResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("[reCAPTCHA] RECAPTCHA_SECRET_KEY is not configured.");
    return { success: false, error: "reCAPTCHA is not configured on the server." };
  }

  if (!token || token.trim().length === 0) {
    return { success: false, error: "reCAPTCHA token is missing." };
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, error: "Failed to contact reCAPTCHA service." };
    }

    const data = (await response.json()) as {
      success: boolean;
      score: number;
      action: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      const codes = data["error-codes"]?.join(", ") ?? "unknown";
      console.warn(`[reCAPTCHA] Verification failed. Error codes: ${codes}`);
      return { success: false, score: data.score, error: "reCAPTCHA verification failed." };
    }

    if (data.action !== EXPECTED_ACTION) {
      console.warn(
        `[reCAPTCHA] Action mismatch. Expected "${EXPECTED_ACTION}", got "${data.action}".`
      );
      return { success: false, score: data.score, error: "reCAPTCHA action mismatch." };
    }

    if (data.score < SCORE_THRESHOLD) {
      console.warn(`[reCAPTCHA] Score too low: ${data.score} (threshold: ${SCORE_THRESHOLD})`);
      return {
        success: false,
        score: data.score,
        error: `Score below threshold (${data.score}).`,
      };
    }

    return { success: true, score: data.score };
  } catch (err) {
    console.error("[reCAPTCHA] Unexpected error during verification:", err);
    return { success: false, error: "Unexpected error during reCAPTCHA verification." };
  }
}
