import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const members = await db.teamMember.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return NextResponse.json(members);
  } catch (error) {
    console.error("[admin team GET]", error);
    return NextResponse.json(
      { error: "Failed to load team members." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const role = String(body.role ?? "").trim();
    const slug = String(body.slug ?? "").trim() || slugify(name);
    const initials =
      String(body.initials ?? "").trim() ||
      name
        .split(/\s+/)
        .map((part: string) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ||
      "?";
    const accent = String(body.accent ?? "from-brand-500 to-violet-600");
    const image = body.image ? String(body.image) : null;
    const published = body.published !== undefined ? Boolean(body.published) : true;
    const sortOrder =
      body.sortOrder !== undefined ? Number(body.sortOrder) || 0 : 0;

    if (!name || !role || !slug) {
      return NextResponse.json(
        { error: "Name, role, and slug are required." },
        { status: 400 },
      );
    }

    const member = await db.teamMember.create({
      data: {
        slug,
        name,
        role,
        initials,
        accent,
        image,
        published,
        sortOrder,
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error("[admin team POST]", error);
    return NextResponse.json(
      { error: "Failed to create team member." },
      { status: 500 },
    );
  }
}
