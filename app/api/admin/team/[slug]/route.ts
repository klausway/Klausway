import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { slug } = await context.params;
    const body = await request.json();

    const member = await db.teamMember.update({
      where: { slug },
      data: {
        ...(body.name !== undefined ? { name: String(body.name) } : {}),
        ...(body.role !== undefined ? { role: String(body.role) } : {}),
        ...(body.initials !== undefined
          ? { initials: String(body.initials) }
          : {}),
        ...(body.accent !== undefined ? { accent: String(body.accent) } : {}),
        ...(body.image !== undefined
          ? { image: body.image ? String(body.image) : null }
          : {}),
        ...(body.published !== undefined
          ? { published: Boolean(body.published) }
          : {}),
        ...(body.sortOrder !== undefined
          ? { sortOrder: Number(body.sortOrder) || 0 }
          : {}),
        ...(body.slug !== undefined && body.slug !== slug
          ? { slug: String(body.slug) }
          : {}),
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("[admin team PUT]", error);
    return NextResponse.json(
      { error: "Failed to update team member." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { slug } = await context.params;
    await db.teamMember.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin team DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete team member." },
      { status: 500 },
    );
  }
}
