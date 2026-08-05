import { NextResponse } from "next/server";
import {
  checkContactRateLimit,
  getClientIp,
  guardContactSubmission,
  parseContactBody,
} from "@/lib/contact-security";
import { sendContactEmail } from "@/lib/email";
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

    await sendContactEmail(guarded.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 },
    );
  }
}
