import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const count = await db.adminUser.count();
    return NextResponse.json({ needsBootstrap: count === 0 });
  } catch (error) {
    console.error("[admin setup GET]", error);
    return NextResponse.json(
      { error: "Failed to check admin setup." },
      { status: 500 },
    );
  }
}
