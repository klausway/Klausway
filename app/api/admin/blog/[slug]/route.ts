import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { toPrismaResourceType } from "@/lib/blog";
import { revalidateResources } from "@/lib/revalidate-resources";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

function parseGallery(value: unknown): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

function optionalText(value: unknown): string | null {
  const text = value == null ? "" : String(value).trim();
  return text || null;
}

export async function PUT(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { slug } = await context.params;
    const body = await request.json();
    const galleryImages = parseGallery(body.galleryImages);

    const post = await db.blogPost.update({
      where: { slug },
      data: {
        ...(body.title !== undefined ? { title: String(body.title) } : {}),
        ...(body.excerpt !== undefined ? { excerpt: String(body.excerpt) } : {}),
        ...(body.content !== undefined ? { content: String(body.content) } : {}),
        ...(body.type !== undefined
          ? { type: toPrismaResourceType(body.type) }
          : {}),
        ...(body.published !== undefined
          ? { published: Boolean(body.published) }
          : {}),
        ...(body.date !== undefined ? { date: new Date(String(body.date)) } : {}),
        ...(body.coverImage !== undefined
          ? { coverImage: body.coverImage ? String(body.coverImage) : null }
          : {}),
        ...(galleryImages !== undefined ? { galleryImages } : {}),
        ...(body.metaTitle !== undefined
          ? { metaTitle: optionalText(body.metaTitle) }
          : {}),
        ...(body.metaDescription !== undefined
          ? { metaDescription: optionalText(body.metaDescription) }
          : {}),
        ...(body.ogImage !== undefined
          ? { ogImage: optionalText(body.ogImage) }
          : {}),
        ...(body.slug !== undefined && body.slug !== slug
          ? { slug: String(body.slug) }
          : {}),
      },
    });

    revalidateResources(slug, post.slug);
    return NextResponse.json(post);
  } catch (error) {
    console.error("[admin blog PUT]", error);
    return NextResponse.json(
      { error: "Failed to update resource." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const { slug } = await context.params;
    await db.blogPost.delete({ where: { slug } });
    revalidateResources(slug);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[admin blog DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete resource." },
      { status: 500 },
    );
  }
}
