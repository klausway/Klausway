/** Abuse guards for the public contact form / Resend endpoint. */

const MAX = {
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 40,
  message: 5000,
} as const;

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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  companyWebsite: string;
  formStartedAt: number | null;
};

export type ContactGuardResult =
  | { ok: true; data: Omit<ContactPayload, "companyWebsite" | "formStartedAt"> }
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

  return {
    firstName: String(record.firstName ?? "").trim(),
    lastName: String(record.lastName ?? "").trim(),
    email: String(record.email ?? "").trim(),
    phone: String(record.phone ?? "").trim(),
    message: String(record.message ?? "").trim(),
    companyWebsite: String(record.companyWebsite ?? "").trim(),
    formStartedAt,
  };
}

/**
 * Validate input and apply bot traps. Rate limiting is separate (`checkContactRateLimit`).
 */
export function guardContactSubmission(payload: ContactPayload): ContactGuardResult {
  // Honeypot — bots often fill every field
  if (payload.companyWebsite) {
    return { ok: false, silent: true };
  }

  // Instant submit (scripts) — missing or too-fast timestamp
  const started = payload.formStartedAt;
  if (started == null || started <= 0) {
    return { ok: false, silent: true };
  }
  const dwell = Date.now() - started;
  if (dwell < MIN_DWELL_MS) {
    return { ok: false, silent: true };
  }
  // Reject absurd future / ancient timestamps (clock skew allowance ~1 day)
  if (dwell > 24 * 60 * 60 * 1000) {
    return { ok: false, status: 400, error: "Please reload the page and try again." };
  }

  const firstName = sanitizeHeaderValue(payload.firstName).slice(0, MAX.firstName);
  const lastName = sanitizeHeaderValue(payload.lastName).slice(0, MAX.lastName);
  const email = sanitizeHeaderValue(payload.email).toLowerCase().slice(0, MAX.email);
  const phone = sanitizeHeaderValue(payload.phone).slice(0, MAX.phone);
  const message = payload.message.replace(/\0/g, "").slice(0, MAX.message).trim();

  if (!firstName || !lastName || !email || !phone || !message) {
    return { ok: false, status: 400, error: "All fields are required." };
  }

  if (
    firstName.length > MAX.firstName ||
    lastName.length > MAX.lastName ||
    email.length > MAX.email ||
    phone.length > MAX.phone ||
    message.length > MAX.message
  ) {
    return { ok: false, status: 400, error: "One or more fields are too long." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, status: 400, error: "Please enter a valid email address." };
  }

  // Phone: allow digits and common separators; require some digits
  const digitCount = (phone.match(/\d/g) ?? []).length;
  if (digitCount < 7 || digitCount > 15) {
    return { ok: false, status: 400, error: "Please enter a valid phone number." };
  }

  if (message.length < 10) {
    return { ok: false, status: 400, error: "Please enter a longer message." };
  }

  return {
    ok: true,
    data: { firstName, lastName, email, phone, message },
  };
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
