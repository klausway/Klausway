import { Resend } from "resend";
import { sanitizeHeaderValue } from "@/lib/contact-security";

type ContactEmailInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Email service is not configured");
  }
  return new Resend(apiKey);
}

export async function sendContactEmail(input: ContactEmailInput) {
  const from = process.env.NOTIFICATION_FROM;
  const to = process.env.CONTACT_TO ?? "support@klausway.com";

  if (!from) {
    throw new Error("Email service is not configured");
  }

  const resend = getResendClient();
  const fullName = sanitizeHeaderValue(
    `${input.firstName} ${input.lastName}`.trim(),
  ).slice(0, 160);
  const safeEmail = sanitizeHeaderValue(input.email).slice(0, 254);
  const safePhone = sanitizeHeaderValue(input.phone).slice(0, 40);
  const safeMessage = input.message.replace(/\0/g, "").slice(0, 5000);

  return resend.emails.send({
    from,
    to,
    replyTo: safeEmail,
    subject: `Contact from ${fullName || "website visitor"}`,
    text: [
      `Name: ${fullName}`,
      `Email: ${safeEmail}`,
      `Phone: ${safePhone}`,
      "",
      safeMessage,
    ].join("\n"),
  });
}
