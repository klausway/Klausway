import type { MetadataRoute } from "next";
import { getPublishedResourcePosts } from "@/lib/blog-data";
import { featuredProducts } from "@/lib/featured-products";
import { routes } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

const staticPaths = [
  routes.home,
  routes.about,
  routes.apps,
  routes.products,
  routes.solutions,
  routes.integrations,
  routes.resources,
  routes.contact,
  routes.privacyPolicy,
  routes.termsOfService,
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const resourcePosts = await getPublishedResourcePosts();

  const priorityFor = (path: string): number => {
    if (path === routes.home) return 1;
    if (path === routes.contact) return 0.9;
    if (
      path === routes.products ||
      path === routes.about ||
      path === routes.apps ||
      path === routes.solutions
    ) {
      return 0.85;
    }
    return 0.7;
  };

  const pages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: priorityFor(path),
  }));

  const posts: MetadataRoute.Sitemap = resourcePosts.map((post) => ({
    url: absoluteUrl(`${routes.resources}/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const products: MetadataRoute.Sitemap = featuredProducts
    .filter((product) => !product.productUrl)
    .map((product) => ({
      url: absoluteUrl(`${routes.products}/${product.id}`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [...pages, ...posts, ...products];
}
