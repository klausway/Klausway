import { db } from "@/lib/db";
import { teamMembers as staticTeamMembers, type TeamMember } from "@/lib/about";

function mapTeamMember(member: {
  slug: string;
  name: string;
  role: string;
  image: string | null;
  initials: string;
  accent: string;
  sortOrder: number;
}): TeamMember {
  return {
    slug: member.slug,
    name: member.name,
    role: member.role,
    image: member.image,
    initials: member.initials,
    accent: member.accent,
    sortOrder: member.sortOrder,
  };
}

/** When DATABASE_URL is set, the database is the source of truth (CMS edits). */
export async function getPublishedTeamMembers(): Promise<TeamMember[]> {
  if (!process.env.DATABASE_URL) {
    return staticTeamMembers;
  }

  try {
    const members = await db.teamMember.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
    return members.map(mapTeamMember);
  } catch (error) {
    console.error("[team-data] getPublishedTeamMembers", error);
    return staticTeamMembers;
  }
}
