/** Abuse guards for the public contact form / Resend endpoint. */

import { createHash, timingSafeEqual } from "crypto";

const MAX = {
  name: 160,
  email: 254,
  phone: 40,
  message: 5000,
  intent: 40,
  source: 80,
  company: 160,
  size: 40,
} as const;

const SIZE_LABELS: Record<string, string> = {
  small: "Small business",
  sme: "Growing SME",
  enterprise: "Enterprise",
};

/** Bots that fill the honeypot or fire instantly get a fake success (no email). */
export const MIN_DWELL_MS = 2500;

const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_MAX_PER_KEY = 5;

type RateBucket = { timestamps: number[] };

const globalStore = globalThis as unknown as {
  __klauswayContactRate?: Map<string, RateBucket>;
};

function rateMap() {
  if (!globalStore.__klauswayContactRate) {
    globalStore.__klauswayContactRate = new Map();
  }
  return globalStore.__klauswayContactRate;
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "unknown";
}

/** Strip control chars / CR-LF that break email headers. */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\0-\x1F\x7F]/g, " ").replace(/\s+/g, " ").trim();
}

function isValidEmail(email: string): boolean {
  if (email.length > MAX.email) return false;
  if (/[\r\n]/.test(email)) return false;
  // Practical RFC-ish check — not full RFC 5322
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  message: string;
  intent: string;
  source: string;
  company: string;
  size: string;
  /** Honeypot — must stay empty. Obscure name reduces browser autofill. */
  hpField: string;
  formStartedAt: number | null;
};

export type ContactGuardOptions = {
  /** Server-to-server ingest from klaus-connect.com — skip dwell / recaptcha traps. */
  trustedIngest?: boolean;
};

/** Header shared by Klaus Connect when proxying leads into this API. */
export const CONTACT_INGEST_HEADER = "x-contact-ingest-secret";

export function isContactIngestAuthorized(request: Request): boolean {
  const secret = process.env.CONTACT_INGEST_SECRET?.trim() ?? "";
  const provided = request.headers.get(CONTACT_INGEST_HEADER)?.trim() ?? "";
  const a = createHash("sha256").update(provided).digest();
  const b = createHash("sha256").update(secret).digest();
  return Boolean(secret && provided && timingSafeEqual(a, b));
}

export type GuardedContact = {
  name: string;
  email: string;
  phone: string;
  message: string;
  intent: string;
  source: string;
};

export type ContactGuardResult =
  | { ok: true; data: GuardedContact }
  | { ok: false; status: number; error: string }
  /** Silent drop — respond 200 without sending mail (bot traps). */
  | { ok: false; silent: true };

export function parseContactBody(body: unknown): ContactPayload {
  const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const formStartedRaw = record.formStartedAt;
  let formStartedAt: number | null = null;
  if (typeof formStartedRaw === "number" && Number.isFinite(formStartedRaw)) {
    formStartedAt = formStartedRaw;
  } else if (typeof formStartedRaw === "string" && formStartedRaw.trim()) {
    const n = Number(formStartedRaw);
    if (Number.isFinite(n)) formStartedAt = n;
  }

  // Accept legacy firstName/lastName clients too
  const legacyName = `${String(record.firstName ?? "").trim()} ${String(
    record.lastName ?? "",
  ).trim()}`.trim();

  return {
    name: String(record.name ?? "").trim() || legacyName,
    email: String(record.email ?? "").trim(),
    phone: String(record.phone ?? "").trim(),
    message: String(record.message ?? "").trim(),
    intent: String(record.intent ?? "").trim(),
    source: String(record.source ?? "").trim(),
    company: String(record.company ?? "").trim(),
    size: String(record.size ?? "").trim(),
    // Accept legacy honeypot names too (older clients + Klaus Connect `website`)
    hpField: String(
      record.hpField ?? record.companyWebsite ?? record.website ?? "",
    ).trim(),
    formStartedAt,
  };
}

/**
 * Validate input and apply bot traps. Rate limiting is separate (`checkContactRateLimit`).
 */
export function guardContactSubmission(
  payload: ContactPayload,
  options: ContactGuardOptions = {},
): ContactGuardResult {
  const trustedIngest = Boolean(options.trustedIngest);

  // Honeypot — bots often fill every field
  if (payload.hpField) {
    console.warn("[contact] honeypot tripped");
    return { ok: false, silent: true };
  }

  if (!trustedIngest) {
    // Instant submit (scripts) — missing or too-fast timestamp
    const started = payload.formStartedAt;
    if (started == null || started <= 0) {
      console.warn("[contact] missing formStartedAt");
      return { ok: false, silent: true };
    }
    const dwell = Date.now() - started;
    if (dwell < MIN_DWELL_MS) {
      console.warn("[contact] submit too fast", { dwell });
      return { ok: false, silent: true };
    }
    // Reject absurd future / ancient timestamps (clock skew allowance ~1 day)
    if (dwell > 24 * 60 * 60 * 1000) {
      return { ok: false, status: 400, error: "Please reload the page and try again." };
    }
  }

  const name = sanitizeHeaderValue(payload.name).slice(0, MAX.name);
  const email = sanitizeHeaderValue(payload.email).toLowerCase().slice(0, MAX.email);
  let phone = sanitizeHeaderValue(payload.phone).slice(0, MAX.phone);
  const company = sanitizeHeaderValue(payload.company).slice(0, MAX.company);
  const size = sanitizeHeaderValue(payload.size).slice(0, MAX.size);
  const intent = sanitizeHeaderValue(payload.intent).slice(0, MAX.intent);
  const source = sanitizeHeaderValue(payload.source).slice(0, MAX.source);
  const rawMessage = payload.message.replace(/\0/g, "").slice(0, MAX.message).trim();
  const message = composeLeadMessage({ company, size, message: rawMessage });

  if (!name || !email) {
    return { ok: false, status: 400, error: "Name and email are required." };
  }

  if (!trustedIngest && !rawMessage) {
    return { ok: false, status: 400, error: "Name, email, and message are required." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, status: 400, error: "Please enter a valid email address." };
  }

  // Phone is optional; when provided, require a plausible number
  if (phone) {
    const digitCount = (phone.match(/\d/g) ?? []).length;
    if (digitCount < 7 || digitCount > 15) {
      if (trustedIngest) {
        phone = "";
      } else {
        return { ok: false, status: 400, error: "Please enter a valid phone number." };
      }
    }
  }

  if (!trustedIngest && rawMessage.length < 10) {
    return { ok: false, status: 400, error: "Please enter a longer message." };
  }

  return {
    ok: true,
    data: { name, email, phone, message, intent, source },
  };
}

function composeLeadMessage(input: {
  company: string;
  size: string;
  message: string;
}): string {
  const extras: string[] = [];
  if (input.company) extras.push(`Company: ${input.company}`);
  if (input.size) {
    extras.push(`Business size: ${SIZE_LABELS[input.size] ?? input.size}`);
  }
  const userMessage = input.message || (extras.length ? "(none)" : "");
  if (extras.length === 0) return userMessage;
  return [...extras, "", userMessage].join("\n").slice(0, MAX.message);
}

function pruneAndCount(bucket: RateBucket, now: number): number {
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  return bucket.timestamps.length;
}

/**
 * In-memory rate limit (per serverless instance). Pair with Vercel WAF for production.
 * Returns true if the request is allowed (and records it).
 */
export function checkContactRateLimit(ip: string, email: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const map = rateMap();
  const keys = [`ip:${ip}`, `email:${email.toLowerCase()}`];

  for (const key of keys) {
    const bucket = map.get(key) ?? { timestamps: [] };
    const count = pruneAndCount(bucket, now);
    map.set(key, bucket);
    if (count >= RATE_MAX_PER_KEY) {
      const oldest = bucket.timestamps[0] ?? now;
      const retryAfterSec = Math.max(1, Math.ceil((RATE_WINDOW_MS - (now - oldest)) / 1000));
      return { allowed: false, retryAfterSec };
    }
  }

  for (const key of keys) {
    const bucket = map.get(key) ?? { timestamps: [] };
    bucket.timestamps.push(now);
    map.set(key, bucket);
  }

  return { allowed: true };
}
