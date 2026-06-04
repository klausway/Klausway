import { NextResponse } from "next/server";
import {
  forbiddenResponse,
  toPublicUser,
  verifyFullAdmin,
} from "@/lib/admin-auth";
import { parseAdminRole, roleToDb } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const admin = await verifyFullAdmin(request);
  if (!admin) return forbiddenResponse();

  const { id } = await context.params;

  try {
    const body = await request.json();
    const updates: { role?: "ADMIN" | "CONTENT"; name?: string } = {};

    if (body.role !== undefined) {
      updates.role = roleToDb(parseAdminRole(body.role));
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) {
        return NextResponse.json({ error: "Name is required." }, { status: 400 });
      }
      updates.name = name;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }

    const target = await db.adminUser.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (updates.role === "CONTENT" && target.role === "ADMIN") {
      const adminCount = await db.adminUser.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the last admin account." },
          { status: 400 },
        );
      }
    }

    const user = await db.adminUser.update({
      where: { id },
      data: updates,
    });

    return NextResponse.json({ ok: true, user: toPublicUser(user) });
  } catch (error) {
    console.error("[admin users PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update user." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const admin = await verifyFullAdmin(request);
  if (!admin) return forbiddenResponse();

  const { id } = await context.params;

  try {
    const body = await request.json();
    const password = String(body.password ?? "");

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const target = await db.adminUser.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    await db.adminUser.update({
      where: { id },
      data: { passwordHash: await hashPassword(password) },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin users PUT password]", error);
    return NextResponse.json(
      { error: "Failed to update password." },
      { status: 500 },
    );
  }
}
