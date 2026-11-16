import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { toPrismaResourceType } from "@/lib/blog";
import { revalidateResources } from "@/lib/revalidate-resources";

function parseGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
}

function optionalText(value: unknown): string | null {
  const text = value == null ? "" : String(value).trim();
  return text || null;
}

export async function GET(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const posts = await db.blogPost.findMany({
      orderBy: { date: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[admin blog GET]", error);
    return NextResponse.json(
      { error: "Failed to load resources." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin(request))) return unauthorizedResponse();

  try {
    const body = await request.json();
    const slug = String(body.slug ?? "").trim();
    const title = String(body.title ?? "").trim();
    const excerpt = String(body.excerpt ?? "").trim();
    const content = String(body.content ?? excerpt).trim();
    const published = Boolean(body.published);
    const date = body.date ? new Date(String(body.date)) : new Date();
    const coverImage = body.coverImage ? String(body.coverImage) : null;
    const galleryImages = parseGallery(body.galleryImages);
    const type = toPrismaResourceType(body.type);
    const metaTitle = optionalText(body.metaTitle);
    const metaDescription = optionalText(body.metaDescription);
    const ogImage = optionalText(body.ogImage);

    if (!slug || !title || !excerpt) {
      return NextResponse.json(
        { error: "Slug, title, and excerpt are required." },
        { status: 400 },
      );
    }

    const post = await db.blogPost.create({
      data: {
        slug,
        title,
        excerpt,
        content,
        type,
        coverImage,
        galleryImages,
        metaTitle,
        metaDescription,
        ogImage,
        published,
        date,
      },
    });

    revalidateResources(post.slug);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[admin blog POST]", error);
    return NextResponse.json(
      { error: "Failed to create resource." },
      { status: 500 },
    );
  }
}
