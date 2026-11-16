/**
 * Safe one-shot backfill: fill empty BlogPost metaTitle / metaDescription
 * from title / excerpt only. Never overwrites non-empty values.
 *
 * Usage:
 *   node --env-file=.env scripts/backfill-blog-seo-meta.js
 *   node --env-file=.env scripts/backfill-blog-seo-meta.js --dry-run
 */
const { PrismaClient } = require("@prisma/client");

const DRY_RUN = process.argv.includes("--dry-run");

function collapseWs(value) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

function softTruncate(value, max) {
  const text = collapseWs(value);
  if (!text) return "";
  if (text.length <= max) return text;
  const budget = Math.max(1, max - 1);
  const cut = text.slice(0, budget);
  const space = cut.lastIndexOf(" ");
  const base = space > Math.floor(budget * 0.6) ? cut.slice(0, space) : cut;
  return `${base.trimEnd()}…`;
}

function buildEmptyMetaPatch(post) {
  const patch = {};
  if (!collapseWs(post.metaTitle ?? "")) {
    const next = softTruncate(post.title, 70);
    if (next) patch.metaTitle = next;
  }
  if (!collapseWs(post.metaDescription ?? "")) {
    const next = softTruncate(post.excerpt, 160);
    if (next) patch.metaDescription = next;
  }
  return patch;
}

async function main() {
  const db = new PrismaClient();
  try {
    const posts = await db.blogPost.findMany({
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        metaTitle: true,
        metaDescription: true,
        published: true,
      },
      orderBy: { date: "desc" },
    });

    const updates = [];
    for (const post of posts) {
      const patch = buildEmptyMetaPatch(post);
      if (Object.keys(patch).length === 0) continue;
      updates.push({ slug: post.slug, published: post.published, patch });
    }

    console.log(
      JSON.stringify(
        {
          dryRun: DRY_RUN,
          scanned: posts.length,
          toUpdate: updates.length,
          sample: updates.slice(0, 8),
        },
        null,
        2,
      ),
    );

    if (DRY_RUN || updates.length === 0) return;

    let updated = 0;
    for (const row of updates) {
      await db.blogPost.update({
        where: { slug: row.slug },
        data: row.patch,
      });
      updated += 1;
    }
    console.log(JSON.stringify({ updated }, null, 2));
  } finally {
    await db.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
