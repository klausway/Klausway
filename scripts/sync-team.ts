import { PrismaClient } from "@prisma/client";
import { teamMembers } from "../lib/about";

/**
 * Makes the DB team match lib/about.ts: upserts every listed member and
 * unpublishes (never deletes) anyone else, so CMS-only rows can be restored.
 */
const db = new PrismaClient();

async function main() {
  const slugs = teamMembers.map((member) => member.slug);

  for (const member of teamMembers) {
    const existing = await db.teamMember.findUnique({ where: { slug: member.slug } });
    const data = {
      name: member.name,
      role: member.role,
      initials: member.initials,
      accent: member.accent,
      bio: member.bio ?? [],
      sortOrder: member.sortOrder ?? 0,
      published: true,
      image: existing?.image?.startsWith("http")
        ? existing.image
        : (member.image ?? existing?.image ?? null),
    };
    await db.teamMember.upsert({
      where: { slug: member.slug },
      create: { slug: member.slug, ...data },
      update: data,
    });
    console.log(`${existing ? "updated" : "created"}  ${member.slug}`);
  }

  const hidden = await db.teamMember.updateMany({
    where: { slug: { notIn: slugs }, published: true },
    data: { published: false },
  });
  console.log(`unpublished ${hidden.count} member(s) not in lib/about.ts`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
