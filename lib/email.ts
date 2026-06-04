import { Resend } from "resend";

type ContactEmailInput = {
  firstName: string;
  lastName: string;
  email: string;
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
  const fullName = `${input.firstName} ${input.lastName}`.trim();

  return resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Contact from ${fullName}`,
    text: [
      `Name: ${fullName}`,
      `Email: ${input.email}`,
      "",
      input.message,
    ].join("\n"),
  });
}
