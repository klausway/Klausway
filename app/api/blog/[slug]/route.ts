import { NextResponse } from "next/server";
import { getBlogPost } from "@/lib/blog-data";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const post = await getBlogPost(slug);

    if (!post) {
      return NextResponse.json({ error: "Post not found." }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("[blog GET slug]", error);
    return NextResponse.json(
      { error: "Failed to load blog post." },
      { status: 500 },
    );
  }
}
