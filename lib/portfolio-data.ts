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

export async function getPublishedPortfolioProjects(): Promise<PortfolioProject[]> {
  if (!process.env.DATABASE_URL) {
    return staticPortfolioProjects;
  }

  try {
    const projects = await db.portfolioProject.findMany({
      where: { published: true },
      orderBy: { title: "asc" },
    });

    if (projects.length > 0) {
      return projects.map((project) => mapPortfolioProject(project));
    }
  } catch (error) {
    console.error("[portfolio-data] getPublishedPortfolioProjects", error);
  }

  return staticPortfolioProjects;
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

    if (project) return mapPortfolioProject(project);
  } catch (error) {
    console.error("[portfolio-data] getPortfolioProject", error);
  }

  return staticPortfolioProjects.find((item) => item.id === slug);
}

export { portfolioCategories };
