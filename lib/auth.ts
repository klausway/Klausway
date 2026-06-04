import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import type { AdminRole } from "@/lib/admin-roles";

export type AuthUser = {
  userId: string;
  email: string;
  name: string;
  role: AdminRole;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET ?? process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("JWT secret is not configured");
  }
  return new TextEncoder().encode(secret);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createAuthToken(user: AuthUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthUser> {
  const { payload } = await jwtVerify(token, getJwtSecret());
  const userId = payload.sub;
  const email = payload.email;
  const name = payload.name;
  const role = payload.role;

  if (typeof userId !== "string" || typeof email !== "string" || typeof name !== "string") {
    throw new Error("Invalid token payload");
  }

  return {
    userId,
    email,
    name,
    role: role === "admin" || role === "content" ? role : "content",
  };
}
