import { NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";

function parseGallery(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map(String).filter(Boolean);
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
      { error: "Failed to load blog posts." },
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
        coverImage,
        galleryImages,
        published,
        date,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("[admin blog POST]", error);
    return NextResponse.json(
      { error: "Failed to create blog post." },
      { status: 500 },
    );
  }
}
