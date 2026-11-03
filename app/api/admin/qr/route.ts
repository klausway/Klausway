import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { forbiddenResponse, verifyFullAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseQrInput } from "@/lib/qr";

export async function GET(request: Request) {
  if (!(await verifyFullAdmin(request))) return forbiddenResponse();

  try {
    const codes = await db.qrCode.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(codes);
  } catch (error) {
    console.error("[admin qr GET]", error);
    return NextResponse.json({ error: "Failed to load QR codes." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyFullAdmin(request))) return forbiddenResponse();

  const parsed = parseQrInput(await request.json());
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const code = await db.qrCode.create({ data: parsed.data });
    return NextResponse.json(code, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    console.error("[admin qr POST]", error);
    return NextResponse.json({ error: "Failed to create QR code." }, { status: 500 });
  }
}
