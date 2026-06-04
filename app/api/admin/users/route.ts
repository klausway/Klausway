import { NextResponse } from "next/server";
import {
  forbiddenResponse,
  toPublicUser,
  unauthorizedResponse,
  verifyFullAdmin,
} from "@/lib/admin-auth";
import { parseAdminRole, roleFromDb, roleToDb } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { createAuthToken, hashPassword } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await verifyFullAdmin(request))) return forbiddenResponse();

  try {
    const users = await db.adminUser.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users.map((u) => toPublicUser(u)));
  } catch (error) {
    console.error("[admin users GET]", error);
    return NextResponse.json(
      { error: "Failed to load admin users." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminCount = await db.adminUser.count();
    const isBootstrap = adminCount === 0;

    if (!isBootstrap && !(await verifyFullAdmin(request))) {
      return forbiddenResponse();
    }

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");
    const role = isBootstrap
      ? "admin"
      : parseAdminRole(body.role, "content");

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
      );
    }

    const user = await db.adminUser.create({
      data: {
        name,
        email,
        passwordHash: await hashPassword(password),
        role: roleToDb(role),
      },
    });

    const responseUser = toPublicUser(user);

    if (isBootstrap) {
      const token = await createAuthToken({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: roleFromDb(user.role),
      });

      return NextResponse.json(
        { ok: true, user: responseUser, token, bootstrap: true },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { ok: true, user: responseUser },
      { status: 201 },
    );
  } catch (error) {
    console.error("[admin users POST]", error);
    return NextResponse.json(
      { error: "Failed to create admin account." },
      { status: 500 },
    );
  }
}
