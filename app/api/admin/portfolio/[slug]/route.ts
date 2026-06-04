import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function parseGallery(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const galleryImages = parseGallery(body.galleryImages);

    const project = await db.portfolioProject.update({
      where: { slug },
      data: {
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.description !== undefined
          ? { description: String(body.description) }
          : {}),
        ...(body.overview !== undefined ? { overview: String(body.overview) } : {}),
        ...(body.categories !== undefined ? { categories: body.categories } : {}),
        ...(body.tags !== undefined ? { tags: body.tags } : {}),
        ...(body.accent !== undefined ? { accent: String(body.accent) } : {}),
        ...(body.keyFeatures !== undefined
          ? { keyFeatures: body.keyFeatures }
          : {}),
        ...(body.benefits !== undefined ? { benefits: body.benefits } : {}),
        ...(body.useCases !== undefined ? { useCases: body.useCases } : {}),
        ...(body.published !== undefined
          ? { published: Boolean(body.published) }
          : {}),
        ...(body.coverImage !== undefined
          ? { coverImage: body.coverImage ? String(body.coverImage) : null }
          : {}),
        ...(galleryImages !== undefined ? { galleryImages } : {}),
        ...(body.slug !== undefined && body.slug !== slug
          ? { slug: String(body.slug) }
          : {}),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("[admin portfolio PUT]", error);
    return NextResponse.json(
      { error: "Failed to update portfolio project." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { slug } = await context.params;
    await db.portfolioProject.delete({ where: { slug } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin portfolio DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio project." },
      { status: 500 },
    );
  }
}
