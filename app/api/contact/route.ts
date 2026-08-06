import { NextResponse } from "next/server";
import {
  checkContactRateLimit,
  getClientIp,
  guardContactSubmission,
  parseContactBody,
} from "@/lib/contact-security";
import { db } from "@/lib/db";
import { sendContactEmail, sendLeadConfirmationEmail } from "@/lib/email";
import { verifyRecaptchaV3 } from "@/lib/recaptcha";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const recaptchaToken =
      typeof record.recaptchaToken === "string" ? record.recaptchaToken : undefined;

    const captcha = await verifyRecaptchaV3(recaptchaToken);
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error }, { status: captcha.status });
    }

    const payload = parseContactBody(body);
    const guarded = guardContactSubmission(payload);

    if (!guarded.ok) {
      if ("silent" in guarded) {
        // Fake success so bots don't learn which check failed
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json(
        { error: guarded.error },
        { status: guarded.status },
      );
    }

    const ip = getClientIp(request);
    const rate = checkContactRateLimit(ip, guarded.data.email);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "Too many messages. Please try again later.",
        },
        {
          status: 429,
          headers: rate.retryAfterSec
            ? { "Retry-After": String(rate.retryAfterSec) }
            : undefined,
        },
      );
    }

    // Persist first — a saved lead survives an email outage.
    let persisted = false;
    try {
      await db.contactSubmission.create({
        data: {
          name: guarded.data.name,
          email: guarded.data.email,
          phone: guarded.data.phone || null,
          message: guarded.data.message,
          intent: guarded.data.intent || null,
          source: guarded.data.source || null,
        },
      });
      persisted = true;
    } catch (dbError) {
      console.error("[contact] failed to persist lead", dbError);
    }

    try {
      await sendContactEmail(guarded.data);
    } catch (emailError) {
      // Lead is already saved — don't surface a failure to the visitor.
      if (!persisted) throw emailError;
      console.error("[contact] notification email failed (lead saved)", emailError);
    }

    // Fire-and-forget confirmation to the lead.
    void sendLeadConfirmationEmail(guarded.data).catch((err) => {
      console.error("[contact] confirmation email failed", err);
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
