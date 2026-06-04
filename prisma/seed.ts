import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../lib/blog";
import { portfolioProjects } from "../lib/portfolio";

const db = new PrismaClient();

async function main() {
  for (const post of blogPosts) {
    await db.blogPost.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.excerpt,
        date: new Date(post.date),
        published: true,
      },
      create: {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.excerpt,
        date: new Date(post.date),
        published: true,
      },
    });
  }

  for (const project of portfolioProjects) {
    await db.portfolioProject.upsert({
      where: { slug: project.id },
      update: {
        title: project.title,
        description: project.description,
        overview: project.overview,
        categories: project.categories,
        tags: project.tags,
        accent: project.accent,
        keyFeatures: project.keyFeatures,
        benefits: project.benefits,
        useCases: project.useCases,
        published: true,
      },
      create: {
        slug: project.id,
        title: project.title,
        description: project.description,
        overview: project.overview,
        categories: project.categories,
        tags: project.tags,
        accent: project.accent,
        keyFeatures: project.keyFeatures,
        benefits: project.benefits,
        useCases: project.useCases,
        published: true,
      },
    });
  }

  console.log(
    `Seeded ${blogPosts.length} blog posts and ${portfolioProjects.length} portfolio projects.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
