import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must not exceed 80 characters"),
  email: z.string().email("Please provide a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long")
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company name is too long")
    .or(z.literal("")),
  service: z.enum([
    "Frontend Development",
    "Backend Development",
    "Full Stack Development",
    "API Design",
    "Database Optimization",
    "Performance Audit",
    "Other",
  ]),
  budget: z.enum([
    "Under $2k",
    "$2k - $5k",
    "$5k - $10k",
    "$10k+",
  ]),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject must not exceed 150 characters"),
  message: z
    .string()
    .min(15, "Message must be at least 15 characters")
    .max(3000, "Message must not exceed 3000 characters"),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must accept the privacy policies to proceed.",
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const contactResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      id: z.string(),
      email: z.string(),
      createdAt: z.string(),
    })
    .optional(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;
