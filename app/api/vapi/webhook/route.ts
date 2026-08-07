import { NextResponse } from "next/server";
import { sendCallSummaryEmail } from "@/lib/email";
import {
  getMessageType,
  parseEndOfCallReport,
  verifyVapiRequest,
} from "@/lib/vapi-webhook";

export async function POST(request: Request) {
  // The HMAC check needs the exact bytes Vapi signed, so read text before JSON.
  const rawBody = await request.text();

  if (!verifyVapiRequest(request, rawBody)) {
    console.warn("[vapi] rejected unverified webhook");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const type = getMessageType(body);

  // Vapi retries non-2xx responses, so acknowledge the event types we ignore.
  if (type !== "end-of-call-report") {
    return NextResponse.json({ ok: true, ignored: type });
  }

  const report = parseEndOfCallReport(body);

  try {
    await sendCallSummaryEmail(report);
  } catch (error) {
    // Surface a 5xx so Vapi retries — a missed call notification costs more
    // than an occasional duplicate.
    console.error("[vapi] call summary email failed", { callId: report.callId }, error);
    return NextResponse.json({ error: "Notification failed." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
