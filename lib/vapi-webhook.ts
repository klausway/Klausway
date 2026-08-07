/** Verification and payload shaping for Vapi server webhooks. */

import crypto from "node:crypto";

export type VapiCallReport = {
  callId: string;
  startedAt: string;
  endedAt: string;
  endedReason: string;
  duration: string;
  customer: string;
  assistant: string;
  summary: string;
  transcript: string;
  recordingUrl: string;
};

const MAX_TRANSCRIPT_CHARS = 20000;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function timingSafeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

/**
 * Vapi authenticates webhooks in one of three ways depending on how the server
 * URL is configured in the dashboard: a custom credential sending the secret in
 * `x-vapi-secret`, an inline `secret` echoed in `x-vapi-signature`, or the HMAC
 * integration signing the body. Accept all three so the endpoint keeps working
 * whichever one is set.
 */
export function verifyVapiRequest(request: Request, rawBody: string): boolean {
  const secret = process.env.VAPI_WEBHOOK_SECRET;
  if (!secret) return false;

  const shared = request.headers.get("x-vapi-secret");
  if (shared && timingSafeEqual(shared, secret)) return true;

  const signature = request.headers.get("x-vapi-signature");
  if (!signature) return false;

  if (timingSafeEqual(signature, secret)) return true;

  const provided = signature.replace(/^sha256=/i, "").toLowerCase();
  const digest = crypto
    .createHmac("sha256", secret)
    .update(rawBody, "utf8")
    .digest("hex");
  return timingSafeEqual(provided, digest);
}

export function getMessageType(body: unknown): string {
  return asString(asRecord(asRecord(body).message).type);
}

function formatDuration(startedAt: string, endedAt: string): string {
  const start = Date.parse(startedAt);
  const end = Date.parse(endedAt);
  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return "—";

  const totalSeconds = Math.round((end - start) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

function extractTranscript(artifact: Record<string, unknown>): string {
  const direct = asString(artifact.transcript).trim();
  if (direct) return direct.slice(0, MAX_TRANSCRIPT_CHARS);

  const messages = Array.isArray(artifact.messages) ? artifact.messages : [];
  const lines = messages
    .map((entry) => {
      const record = asRecord(entry);
      const role = asString(record.role);
      const text = asString(record.message) || asString(record.content);
      if (!text || role === "system") return "";
      const speaker = role === "user" ? "Caller" : role === "bot" ? "Assistant" : role;
      return `${speaker || "?"}: ${text}`;
    })
    .filter(Boolean);

  return lines.join("\n").slice(0, MAX_TRANSCRIPT_CHARS);
}

function extractRecordingUrl(artifact: Record<string, unknown>): string {
  const recording = asRecord(artifact.recording);
  return (
    asString(artifact.recordingUrl) ||
    asString(artifact.stereoRecordingUrl) ||
    asString(recording.stereoUrl) ||
    asString(recording.url) ||
    ""
  );
}

export function parseEndOfCallReport(body: unknown): VapiCallReport {
  const message = asRecord(asRecord(body).message);
  const call = asRecord(message.call);
  const artifact = asRecord(message.artifact);
  const analysis = asRecord(message.analysis);
  const customer = asRecord(message.customer ?? call.customer);
  const assistant = asRecord(message.assistant ?? call.assistant);

  const startedAt = asString(message.startedAt) || asString(call.startedAt);
  const endedAt = asString(message.endedAt) || asString(call.endedAt);

  return {
    callId: asString(call.id) || asString(message.callId) || "—",
    startedAt,
    endedAt,
    endedReason: asString(message.endedReason) || "—",
    duration: formatDuration(startedAt, endedAt),
    customer:
      asString(customer.number) ||
      asString(customer.name) ||
      asString(customer.email) ||
      "Web visitor",
    assistant: asString(assistant.name) || asString(call.assistantId) || "—",
    summary: asString(message.summary) || asString(analysis.summary),
    transcript: extractTranscript(artifact),
    recordingUrl: extractRecordingUrl(artifact),
  };
}
