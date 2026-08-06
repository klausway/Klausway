import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const leads = await db.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return NextResponse.json(leads);
  } catch (error) {
    console.error("[admin leads GET]", error);
    return NextResponse.json(
      { error: "Failed to load leads." },
      { status: 500 },
    );
  }
}
