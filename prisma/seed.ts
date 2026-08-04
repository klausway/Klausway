import { PrismaClient } from "@prisma/client";
import { blogPosts } from "../lib/blog";
import { portfolioProjects } from "../lib/portfolio";
import { teamMembers } from "../lib/about";

const db = new PrismaClient();

/** When true, overwrite existing rows with static frontend data. Default: insert missing only. */
const overwrite = process.env.SEED_OVERWRITE === "true";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function blogBodyHtml(title: string, excerpt: string) {
  return [
    `<h2>${escapeHtml(title)}</h2>`,
    `<p>${escapeHtml(excerpt)}</p>`,
    `<p>Edit this article in Content Studio to add the full story, images, and formatting.</p>`,
  ].join("\n");
}

async function main() {
  let blogCreated = 0;
  let blogUpdated = 0;
  let portfolioCreated = 0;
  let portfolioUpdated = 0;
  let teamCreated = 0;
  let teamUpdated = 0;

  for (const post of blogPosts) {
    const existing = await db.blogPost.findUnique({ where: { slug: post.slug } });
    const data = {
      title: post.title,
      excerpt: post.excerpt,
      content: blogBodyHtml(post.title, post.excerpt),
      type:
        post.type === "guide"
          ? ("GUIDE" as const)
          : post.type === "news"
            ? ("NEWS" as const)
            : post.type === "case-study"
              ? ("CASE_STUDY" as const)
              : ("ARTICLE" as const),
      coverImage: post.coverImage ?? null,
      galleryImages: post.galleryImages ?? [],
      date: new Date(post.date),
      published: true,
    };

    if (!existing) {
      await db.blogPost.create({
        data: { slug: post.slug, ...data },
      });
      blogCreated += 1;
      continue;
    }

    if (overwrite) {
      await db.blogPost.update({
        where: { slug: post.slug },
        data,
      });
      blogUpdated += 1;
    }
  }

  for (const project of portfolioProjects) {
    const existing = await db.portfolioProject.findUnique({
      where: { slug: project.id },
    });
    const data = {
      title: project.title,
      description: project.description,
      overview: project.overview,
      coverImage: project.coverImage ?? null,
      galleryImages: project.galleryImages ?? [],
      categories: project.categories,
      tags: project.tags,
      accent: project.accent,
      keyFeatures: project.keyFeatures,
      benefits: project.benefits,
      useCases: project.useCases,
      published: true,
    };

    if (!existing) {
      await db.portfolioProject.create({
        data: { slug: project.id, ...data },
      });
      portfolioCreated += 1;
      continue;
    }

    if (overwrite) {
      await db.portfolioProject.update({
        where: { slug: project.id },
        data,
      });
      portfolioUpdated += 1;
    }
  }

  for (const member of teamMembers) {
    const existing = await db.teamMember.findUnique({
      where: { slug: member.slug },
    });
    const data = {
      name: member.name,
      role: member.role,
      initials: member.initials,
      accent: member.accent,
      image: member.image ?? null,
      sortOrder: member.sortOrder ?? 0,
      published: true,
    };

    if (!existing) {
      await db.teamMember.create({
        data: { slug: member.slug, ...data },
      });
      teamCreated += 1;
      continue;
    }

    if (overwrite) {
      await db.teamMember.update({
        where: { slug: member.slug },
        // Keep an uploaded S3 image if one is already set.
        data: {
          ...data,
          image:
            existing.image?.startsWith("http")
              ? existing.image
              : (member.image ?? existing.image),
        },
      });
      teamUpdated += 1;
    }
  }

  console.log(
    [
      `Seed complete (overwrite=${overwrite}).`,
      `Blog: +${blogCreated} created, ${blogUpdated} updated (${blogPosts.length} static).`,
      `Portfolio: +${portfolioCreated} created, ${portfolioUpdated} updated (${portfolioProjects.length} static).`,
      `Team: +${teamCreated} created, ${teamUpdated} updated (${teamMembers.length} static).`,
      overwrite
        ? "Existing CMS edits were overwritten from frontend static data."
        : "Existing DB rows were left unchanged. Use SEED_OVERWRITE=true to resync from static.",
    ].join("\n"),
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
