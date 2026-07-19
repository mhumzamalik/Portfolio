interface ContactNotificationProps {
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  service?: string | null;
  budget?: string | null;
  subject: string;
  message: string;
  submittedAt: Date;
  status: string;
}

export function buildContactNotificationHtml(
  data: ContactNotificationProps
): string {
  const formatDate = (date: Date): string => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    });
  };

  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const safeValue = (val: string | null | undefined, fallback = "Not specified"): string => {
    return val ? escapeHtml(val) : `<span style="color: #9ca3af;">${fallback}</span>`;
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New Contact Inquiry</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 600; letter-spacing: -0.3px;">
                New Contact Inquiry
              </h1>
              <p style="margin: 8px 0 0; color: #94a3b8; font-size: 13px; letter-spacing: 0.5px;">
                Portfolio Contact Form Submission
              </p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 24px 40px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color: #fef3c7; color: #92400e; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 6px 14px; border-radius: 20px;">
                    ● ${escapeHtml(data.status)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Contact Details -->
          <tr>
            <td style="padding: 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                
                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; background-color: #fafafa;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Full Name</span>
                    <span style="font-size: 15px; color: #111827; font-weight: 500;">${escapeHtml(data.name)}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Email Address</span>
                    <a href="mailto:${escapeHtml(data.email)}" style="font-size: 15px; color: #2563eb; text-decoration: none; font-weight: 500;">${escapeHtml(data.email)}</a>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; background-color: #fafafa;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Phone Number</span>
                    <span style="font-size: 15px; color: #111827;">${safeValue(data.phone)}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Company</span>
                    <span style="font-size: 15px; color: #111827;">${safeValue(data.company)}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px; border-bottom: 1px solid #f3f4f6; background-color: #fafafa;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Service Required</span>
                    <span style="font-size: 15px; color: #111827;">${safeValue(data.service)}</span>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 14px 20px;">
                    <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 4px;">Estimated Budget</span>
                    <span style="font-size: 15px; color: #111827;">${safeValue(data.budget)}</span>
                  </td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Subject -->
          <tr>
            <td style="padding: 0 40px;">
              <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 16px 20px; margin-bottom: 16px;">
                <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 6px;">Subject</span>
                <span style="font-size: 16px; color: #111827; font-weight: 600;">${escapeHtml(data.subject)}</span>
              </div>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <div style="border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; background-color: #f9fafb;">
                <span style="display: block; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #6b7280; font-weight: 600; margin-bottom: 10px;">Message</span>
                <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.7; white-space: pre-line;">${escapeHtml(data.message)}</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 40px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; line-height: 1.6;">
                Submitted on ${formatDate(data.submittedAt)}<br />
                This email was sent from the portfolio contact form at mhamza.dev
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}
