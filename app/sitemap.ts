import type { MetadataRoute } from "next";
import { getPublishedResourcePosts } from "@/lib/blog-data";
import { featuredProducts } from "@/lib/featured-products";
import { portfolioProjects } from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { absoluteUrl } from "@/lib/seo";

const staticPaths = [
  routes.home,
  routes.about,
  routes.apps,
  routes.products,
  routes.resources,
  routes.portfolio,
  routes.contact,
  routes.privacyPolicy,
  routes.termsOfService,
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const resourcePosts = await getPublishedResourcePosts();

  const pages: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: path === routes.home ? "weekly" : "monthly",
    priority: path === routes.home ? 1 : path === routes.contact ? 0.9 : 0.7,
  }));

  const posts: MetadataRoute.Sitemap = resourcePosts.map((post) => ({
    url: absoluteUrl(`${routes.resources}/${post.slug}`),
    lastModified: new Date(post.updatedAt ?? post.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const projects: MetadataRoute.Sitemap = portfolioProjects.map((project) => ({
    url: absoluteUrl(`${routes.portfolio}/${project.id}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const products: MetadataRoute.Sitemap = featuredProducts.map((product) => ({
    url: absoluteUrl(`${routes.products}/${product.id}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...pages, ...posts, ...projects, ...products];
}
