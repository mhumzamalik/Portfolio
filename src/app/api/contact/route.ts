import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { contactFormSchema } from "@/lib/validations/contact";
import { buildContactNotificationHtml } from "@/lib/email/contact-notification";
import type { ContactResponse } from "@/lib/validations/contact";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = contactFormSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ?? "Invalid form data.";

      return NextResponse.json<ContactResponse>(
        { success: false, message: firstError },
        { status: 400 }
      );
    }

    const { name, email, phone, company, service, budget, subject, message } =
      parsed.data;

    let contact;
    try {
      contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone: phone || null,
          company: company || null,
          service: service || null,
          budget: budget || null,
          subject,
          message,
          status: "Pending",
        },
      });
    } catch (dbError) {
      console.error("[contact] Database save failed:", dbError);

      return NextResponse.json<ContactResponse>(
        {
          success: false,
          message:
            "We couldn't save your message right now. Please try again later.",
        },
        { status: 500 }
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;

    if (resend && adminEmail) {
      try {
        const html = buildContactNotificationHtml({
          name,
          email,
          phone,
          company,
          service,
          budget,
          subject,
          message,
          submittedAt: contact.createdAt,
          status: contact.status,
        });

        const { error: emailError } = await resend.emails.send({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Portfolio Inquiry: ${subject}`,
          html,
        });

        if (emailError) {
          console.error("[contact] Resend email error:", emailError);
        }
      } catch (emailError) {
        console.error("[contact] Resend exception:", emailError);
      }
    } else {
      console.warn(
        "[contact] Email skipped — RESEND_API_KEY or ADMIN_EMAIL not configured."
      );
    }

    return NextResponse.json<ContactResponse>(
      {
        success: true,
        message: "Your message has been sent successfully!",
        data: {
          id: contact.id,
          email: contact.email,
          createdAt: contact.createdAt.toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[contact] Unexpected error:", error);

    return NextResponse.json<ContactResponse>(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
