import { RECAPTCHA_CONTACT_ACTION } from "@/lib/recaptcha-constants";

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export { RECAPTCHA_CONTACT_ACTION };

/** Reject scores below this (0.0 = bot, 1.0 = human). */
const MIN_SCORE = 0.5;

export type RecaptchaVerifyResult =
  | { ok: true; score: number }
  | { ok: false; error: string; status: number };

type GoogleSiteVerifyResponse = {
  success: boolean;
  score?: number;
  action?: string;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function getSecret(): string | undefined {
  return process.env.RECAPTCHA_SECRET_KEY?.trim() || undefined;
}

/** True when server is configured to enforce reCAPTCHA. */
export function isRecaptchaConfigured(): boolean {
  return Boolean(getSecret() && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim());
}

/**
 * Verify a reCAPTCHA v3 token with Google.
 * When keys are not configured: allow in development, reject in production.
 */
export async function verifyRecaptchaV3(
  token: string | undefined,
  expectedAction: string = RECAPTCHA_CONTACT_ACTION,
): Promise<RecaptchaVerifyResult> {
  const secret = getSecret();
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();

  if (!secret || !siteKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[recaptcha] RECAPTCHA_SECRET_KEY / NEXT_PUBLIC_RECAPTCHA_SITE_KEY missing");
      return {
        ok: false,
        status: 503,
        error: "Bot protection is not configured. Please try again later.",
      };
    }
    console.warn("[recaptcha] Skipping verify — keys not set (development only)");
    return { ok: true, score: 1 };
  }

  if (!token || token.length > 4000) {
    return {
      ok: false,
      status: 400,
      error: "Bot verification failed. Please refresh and try again.",
    };
  }

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
    });

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    if (!res.ok) {
      console.error("[recaptcha] siteverify HTTP", res.status);
      return {
        ok: false,
        status: 502,
        error: "Bot verification unavailable. Please try again later.",
      };
    }

    const data = (await res.json()) as GoogleSiteVerifyResponse;

    if (!data.success) {
      console.warn("[recaptcha] rejected", data["error-codes"]);
      return {
        ok: false,
        status: 400,
        error: "Bot verification failed. Please refresh and try again.",
      };
    }

    if (data.action && data.action !== expectedAction) {
      console.warn("[recaptcha] action mismatch", data.action, expectedAction);
      return {
        ok: false,
        status: 400,
        error: "Bot verification failed. Please refresh and try again.",
      };
    }

    const score = typeof data.score === "number" ? data.score : 0;
    if (score < MIN_SCORE) {
      console.warn("[recaptcha] low score", score);
      return {
        ok: false,
        status: 400,
        error: "Bot verification failed. Please refresh and try again.",
      };
    }

    return { ok: true, score };
  } catch (error) {
    console.error("[recaptcha] verify error", error);
    return {
      ok: false,
      status: 502,
      error: "Bot verification unavailable. Please try again later.",
    };
  }
}
