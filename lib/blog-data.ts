import { db } from "@/lib/db";
import {
  blogPosts as staticBlogPosts,
  type BlogPost,
} from "@/lib/blog";

function mapBlogPost(post: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  galleryImages: string[];
  date: Date;
}): BlogPost & { content: string } {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage,
    galleryImages: post.galleryImages,
    date: post.date.toISOString().slice(0, 10),
  };
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!process.env.DATABASE_URL) {
    return staticBlogPosts;
  }

  try {
    const posts = await db.blogPost.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });

    if (posts.length > 0) {
      return posts.map((post) => mapBlogPost(post));
    }
  } catch (error) {
    console.error("[blog-data] getPublishedBlogPosts", error);
  }

  return staticBlogPosts;
}

export async function getBlogPost(
  slug: string,
): Promise<(BlogPost & { content: string }) | undefined> {
  if (!process.env.DATABASE_URL) {
    const fallback = staticBlogPosts.find((item) => item.slug === slug);
    if (!fallback) return undefined;
    return { ...fallback, content: fallback.excerpt, galleryImages: [] };
  }

  try {
    const post = await db.blogPost.findFirst({
      where: { slug, published: true },
    });

    if (post) return mapBlogPost(post);
  } catch (error) {
    console.error("[blog-data] getBlogPost", error);
  }

  const fallback = staticBlogPosts.find((item) => item.slug === slug);
  if (!fallback) return undefined;

  return { ...fallback, content: fallback.excerpt, galleryImages: [] };
}
