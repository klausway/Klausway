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
    const projects = await db.portfolioProject.findMany({
      orderBy: { title: "asc" },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("[admin portfolio GET]", error);
    return NextResponse.json(
      { error: "Failed to load portfolio projects." },
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
    const description = String(body.description ?? "").trim();
    const overview = String(body.overview ?? "").trim();

    if (!slug || !title || !description || !overview) {
      return NextResponse.json(
        { error: "Slug, title, description, and overview are required." },
        { status: 400 },
      );
    }

    const project = await db.portfolioProject.create({
      data: {
        slug,
        title,
        description,
        overview,
        coverImage: body.coverImage ? String(body.coverImage) : null,
        galleryImages: parseGallery(body.galleryImages),
        categories: Array.isArray(body.categories) ? body.categories : [],
        tags: Array.isArray(body.tags) ? body.tags : [],
        accent: String(body.accent ?? "from-cyan-400 to-blue-500"),
        keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures : [],
        benefits: Array.isArray(body.benefits) ? body.benefits : [],
        useCases: Array.isArray(body.useCases) ? body.useCases : [],
        published: Boolean(body.published),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[admin portfolio POST]", error);
    return NextResponse.json(
      { error: "Failed to create portfolio project." },
      { status: 500 },
    );
  }
}
