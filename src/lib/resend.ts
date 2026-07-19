import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "[resend] RESEND_API_KEY is not set. Email notifications will be skipped."
  );
}

const globalForResend = global as unknown as { resend: Resend | null };

export const resend: Resend | null =
  globalForResend.resend ??
  (process.env.RESEND_API_KEY
    ? new Resend(process.env.RESEND_API_KEY)
    : null);

if (process.env.NODE_ENV !== "production") {
  globalForResend.resend = resend;
}
