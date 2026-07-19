import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(72, "Password must not exceed 72 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const loginWithCaptchaSchema = loginSchema.extend({
  recaptchaToken: z.string().min(1, "reCAPTCHA token is required."),
});

export type LoginWithCaptchaData = z.infer<typeof loginWithCaptchaSchema>;

export const contactStatusSchema = z.object({
  id: z.string().min(1, "Contact ID is required"),
  status: z.enum(["Pending", "Done", "Completed", "Resolved"]),
});

export type ContactStatusData = z.infer<typeof contactStatusSchema>;
