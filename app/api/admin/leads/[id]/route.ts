import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

const LEAD_STATUSES = ["NEW", "CONTACTED", "CLOSED"] as const;
type LeadStatusValue = (typeof LEAD_STATUSES)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { id } = await params;
    const body = await request.json();
    const status = String(body.status ?? "");
    if (!LEAD_STATUSES.includes(status as LeadStatusValue)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const lead = await db.contactSubmission.update({
      where: { id },
      data: { status: status as LeadStatusValue },
    });
    return NextResponse.json(lead);
  } catch (error) {
    console.error("[admin leads PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update lead." },
      { status: 500 },
    );
  }
}
