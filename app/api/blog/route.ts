import { NextResponse } from "next/server";
import { getPublishedBlogPosts } from "@/lib/blog-data";

export async function GET() {
  try {
    const posts = await getPublishedBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("[blog GET]", error);
    return NextResponse.json(
      { error: "Failed to load blog posts." },
      { status: 500 },
    );
  }
}
