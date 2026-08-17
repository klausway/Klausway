import { db } from "@/lib/db";
import {
  portfolioCategories,
  portfolioProjects as staticPortfolioProjects,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/lib/portfolio";

function mapPortfolioProject(project: {
  slug: string;
  title: string;
  description: string;
  overview: string;
  coverImage: string | null;
  galleryImages: string[];
  categories: string[];
  tags: string[];
  accent: string;
  keyFeatures: string[];
  benefits: string[];
  useCases: string[];
}): PortfolioProject {
  return {
    id: project.slug,
    title: project.title,
    description: project.description,
    overview: project.overview,
    coverImage: project.coverImage,
    galleryImages: project.galleryImages,
    categories: project.categories as PortfolioCategory[],
    tags: project.tags,
    accent: project.accent,
    keyFeatures: project.keyFeatures,
    benefits: project.benefits,
    useCases: project.useCases,
  };
}

/** Overlay product-site links (and public product names) from static data onto CMS rows. */
function withProductSite(project: PortfolioProject): PortfolioProject {
  const published = staticPortfolioProjects.find((item) => item.id === project.id);
  if (!published?.productUrl) return project;
  return {
    ...project,
    productUrl: published.productUrl,
    title: published.title,
    description: published.description,
    overview: published.overview,
  };
}

/** When DATABASE_URL is set, the database is the source of truth (CMS edits). */
export async function getPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  if (!process.env.DATABASE_URL) {
    return staticPortfolioProjects;
  }

  try {
    const projects = await db.portfolioProject.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
    });
    return projects.map((project) => withProductSite(mapPortfolioProject(project)));
  } catch (error) {
    console.error("[portfolio-data] getPublishedPortfolioProjects", error);
    return staticPortfolioProjects;
  }
}

export async function getPortfolioProject(
  slug: string,
): Promise<PortfolioProject | undefined> {
  if (!process.env.DATABASE_URL) {
    return staticPortfolioProjects.find((item) => item.id === slug);
  }

  try {
    const project = await db.portfolioProject.findFirst({
      where: { slug, published: true },
    });
    return project ? withProductSite(mapPortfolioProject(project)) : undefined;
  } catch (error) {
    console.error("[portfolio-data] getPortfolioProject", error);
    return staticPortfolioProjects.find((item) => item.id === slug);
  }
}

export { portfolioCategories };
