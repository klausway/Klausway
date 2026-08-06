import { Resend } from "resend";
import { sanitizeHeaderValue } from "@/lib/contact-security";

type ContactEmailInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  intent: string;
  source: string;
};

const intentLabels: Record<string, string> = {
  demo: "Demo request",
  consult: "Consultation request",
  custom: "Custom software inquiry",
  other: "Inquiry",
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
  const fullName = sanitizeHeaderValue(input.name).slice(0, 160);
  const safeEmail = sanitizeHeaderValue(input.email).slice(0, 254);
  const safePhone = sanitizeHeaderValue(input.phone).slice(0, 40);
  const safeSource = sanitizeHeaderValue(input.source).slice(0, 80);
  const safeMessage = input.message.replace(/\0/g, "").slice(0, 5000);

  const subjectPrefix = intentLabels[input.intent] ?? "Contact";
  const subjectSource = safeSource.startsWith("product:")
    ? ` — ${safeSource.slice("product:".length)}`
    : "";

  const { data, error } = await resend.emails.send({
    from,
    to,
    replyTo: safeEmail,
    subject: `${subjectPrefix}${subjectSource}: ${fullName || "website visitor"}`,
    text: [
      `Name: ${fullName}`,
      `Email: ${safeEmail}`,
      `Phone: ${safePhone || "—"}`,
      `Intent: ${input.intent || "—"}`,
      `Source: ${safeSource || "—"}`,
      "",
      safeMessage,
    ].join("\n"),
  });

  // Resend returns { data, error } and does not always throw
  if (error) {
    console.error("[email] Resend error", error);
    throw new Error(error.message || "Failed to send email via Resend");
  }

  if (!data?.id) {
    console.error("[email] Resend returned no message id", { data, error });
    throw new Error("Failed to send email via Resend");
  }

  console.info("[email] sent", { id: data.id, to });
  return data;
}

/** Confirmation to the lead. Fire-and-forget — never fail the request on error. */
export async function sendLeadConfirmationEmail(input: {
  name: string;
  email: string;
}) {
  const from = process.env.NOTIFICATION_FROM;
  if (!from) return;

  const resend = getResendClient();
  const firstName = sanitizeHeaderValue(input.name).split(" ")[0] || "there";
  const safeEmail = sanitizeHeaderValue(input.email).slice(0, 254);

  const { error } = await resend.emails.send({
    from,
    to: safeEmail,
    subject: "We got your message — Klaus Way",
    text: [
      `Hi ${firstName},`,
      "",
      "Thanks for reaching out to Klaus Way. A real person on our team reads",
      "every message, and we reply within one business day (Mon–Fri, 9:00–4:00 ET).",
      "",
      "If it's urgent, call us at (860) 400-0758.",
      "",
      "In the meantime, you can see the software we build and run:",
      "https://klausway.com/products/",
      "",
      "— The Klaus Way team",
      "29 Northridge Drive, North Windham, CT 06256",
    ].join("\n"),
  });

  if (error) {
    console.error("[email] lead confirmation failed", error);
  }
}
