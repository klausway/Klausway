import { NextResponse } from "next/server";
import { roleFromDb } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { createAuthToken, verifyPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const email = String(record.email ?? "").trim().toLowerCase();
    const password = String(record.password ?? "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const user = await db.adminUser.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const role = roleFromDb(user.role);

    const token = await createAuthToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role,
    });

    return NextResponse.json({
      ok: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role },
    });
  } catch (error) {
    console.error("[admin login]", error);
    const message = error instanceof Error ? error.message : "Failed to sign in.";
    const misconfigured =
      message.includes("JWT secret") || message.includes("Environment variable not found");
    return NextResponse.json(
      {
        error: misconfigured
          ? "Server auth is misconfigured. Check JWT_SECRET / DATABASE_URL."
          : "Failed to sign in.",
        ...(process.env.NODE_ENV === "development" ? { detail: message } : {}),
      },
      { status: misconfigured ? 503 : 500 },
    );
  }
}
