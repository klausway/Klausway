export const ADMIN_ROLES = ["admin", "content"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export function isAdminRole(value: string): value is AdminRole {
  return ADMIN_ROLES.includes(value as AdminRole);
}

export function parseAdminRole(value: unknown, fallback: AdminRole = "content"): AdminRole {
  const role = String(value ?? "").toLowerCase();
  return isAdminRole(role) ? role : fallback;
}

/** Prisma enum ↔ API string */
export function roleFromDb(role: "ADMIN" | "CONTENT"): AdminRole {
  return role === "ADMIN" ? "admin" : "content";
}

export function roleToDb(role: AdminRole): "ADMIN" | "CONTENT" {
  return role === "admin" ? "ADMIN" : "CONTENT";
}
