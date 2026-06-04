import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { createAuthToken, hashPassword } from "@/lib/auth";

export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const users = await db.adminUser.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
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

    if (!isBootstrap && !(await verifyAdmin(request))) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

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
      },
    });

    const responseUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    if (isBootstrap) {
      const token = await createAuthToken({
        userId: user.id,
        email: user.email,
        name: user.name,
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
