import { db } from "@/lib/db";
import {
  fromPrismaResourceType,
  resourcePosts as staticResourcePosts,
  type ResourcePost,
  type ResourceType,
} from "@/lib/blog";

function mapResourcePost(post: {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  type: string;
  coverImage: string | null;
  galleryImages: string[];
  date: Date;
  updatedAt?: Date;
}): ResourcePost & { content: string } {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    type: fromPrismaResourceType(post.type),
    coverImage: post.coverImage,
    galleryImages: post.galleryImages,
    date: post.date.toISOString().slice(0, 10),
    updatedAt: (post.updatedAt ?? post.date).toISOString().slice(0, 10),
  };
}

function staticAsDetail(
  post: ResourcePost,
): ResourcePost & { content: string } {
  return {
    ...post,
    content: post.excerpt,
    galleryImages: post.galleryImages ?? [],
  };
}

/** When DATABASE_URL is set, the database is the source of truth (CMS edits). */
export async function getPublishedResourcePosts(options?: {
  type?: ResourceType | "all";
}): Promise<ResourcePost[]> {
  const typeFilter = options?.type && options.type !== "all" ? options.type : undefined;

  if (!process.env.DATABASE_URL) {
    return typeFilter
      ? staticResourcePosts.filter((post) => post.type === typeFilter)
      : staticResourcePosts;
  }

  try {
    const posts = await db.blogPost.findMany({
      where: {
        published: true,
        ...(typeFilter
          ? {
              type:
                typeFilter === "article"
                  ? "ARTICLE"
                  : typeFilter === "guide"
                    ? "GUIDE"
                    : typeFilter === "news"
                      ? "NEWS"
                      : "CASE_STUDY",
            }
          : {}),
      },
      orderBy: { date: "desc" },
    });
    return posts.map((post) => mapResourcePost(post));
  } catch (error) {
    console.error("[blog-data] getPublishedResourcePosts", error);
    return typeFilter
      ? staticResourcePosts.filter((post) => post.type === typeFilter)
      : staticResourcePosts;
  }
}

export async function getResourcePost(
  slug: string,
): Promise<(ResourcePost & { content: string }) | undefined> {
  if (!process.env.DATABASE_URL) {
    const fallback = staticResourcePosts.find((item) => item.slug === slug);
    return fallback ? staticAsDetail(fallback) : undefined;
  }

  try {
    const post = await db.blogPost.findFirst({
      where: { slug, published: true },
    });
    return post ? mapResourcePost(post) : undefined;
  } catch (error) {
    console.error("[blog-data] getResourcePost", error);
    const fallback = staticResourcePosts.find((item) => item.slug === slug);
    return fallback ? staticAsDetail(fallback) : undefined;
  }
}

/** Related published posts for internal linking on resource detail pages. */
export async function getRelatedResourcePosts(
  slug: string,
  type?: ResourceType,
  limit = 3,
): Promise<ResourcePost[]> {
  const posts = await getPublishedResourcePosts(
    type ? { type } : undefined,
  );
  const sameType = posts.filter((post) => post.slug !== slug);
  if (sameType.length >= limit) return sameType.slice(0, limit);

  const all = await getPublishedResourcePosts();
  const seen = new Set(sameType.map((post) => post.slug));
  for (const post of all) {
    if (post.slug === slug || seen.has(post.slug)) continue;
    sameType.push(post);
    if (sameType.length >= limit) break;
  }
  return sameType.slice(0, limit);
}

/** @deprecated Use getPublishedResourcePosts */
export async function getPublishedBlogPosts(): Promise<ResourcePost[]> {
  return getPublishedResourcePosts();
}

/** @deprecated Use getResourcePost */
export async function getBlogPost(
  slug: string,
): Promise<(ResourcePost & { content: string }) | undefined> {
  return getResourcePost(slug);
}
