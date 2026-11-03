import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { forbiddenResponse, verifyFullAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { parseQrInput } from "@/lib/qr";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: RouteContext) {
  if (!(await verifyFullAdmin(request))) return forbiddenResponse();

  const parsed = parseQrInput(await request.json());
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const { id } = await params;
    const code = await db.qrCode.update({ where: { id }, data: parsed.data });
    return NextResponse.json(code);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "That slug is already in use." }, { status: 409 });
    }
    console.error("[admin qr PUT]", error);
    return NextResponse.json({ error: "Failed to update QR code." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteContext) {
  if (!(await verifyFullAdmin(request))) return forbiddenResponse();

  try {
    const { id } = await params;
    await db.qrCode.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin qr DELETE]", error);
    return NextResponse.json({ error: "Failed to delete QR code." }, { status: 500 });
  }
}
