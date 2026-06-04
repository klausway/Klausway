import { verifyAuthToken, type AuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { roleFromDb } from "@/lib/admin-roles";

export type { AuthUser } from "@/lib/auth";

export async function verifyAdmin(request: Request): Promise<AuthUser | null> {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const token = auth.slice(7).trim();
  if (!token) return null;

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

/** Full admin only — user management, role changes, etc. */
export async function verifyFullAdmin(request: Request): Promise<AuthUser | null> {
  const user = await verifyAdmin(request);
  if (!user || user.role !== "admin") return null;

  const dbUser = await db.adminUser.findUnique({
    where: { id: user.userId },
    select: { role: true },
  });
  if (!dbUser || dbUser.role !== "ADMIN") return null;

  return user;
}

export function unauthorizedResponse() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbiddenResponse() {
  return Response.json({ error: "Forbidden" }, { status: 403 });
}

export function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CONTENT";
  createdAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleFromDb(user.role),
    createdAt: user.createdAt,
  };
}
