/**
 * Safe CMS SEO meta helpers.
 * Only derive from existing title/excerpt — never invent product claims.
 */

const META_TITLE_MAX = 70;
const META_DESCRIPTION_MAX = 160;

function collapseWs(value: string): string {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Soft word-boundary truncate; appends … when shortened. */
export function softTruncate(value: string, max: number): string {
  const text = collapseWs(value);
  if (!text) return "";
  if (text.length <= max) return text;
  const budget = Math.max(1, max - 1);
  const cut = text.slice(0, budget);
  const space = cut.lastIndexOf(" ");
  const base =
    space > Math.floor(budget * 0.6) ? cut.slice(0, space) : cut;
  return `${base.trimEnd()}…`;
}

/** Fill empty metaTitle from post title only. */
export function deriveMetaTitle(title: string): string {
  return softTruncate(title, META_TITLE_MAX);
}

/** Fill empty metaDescription from excerpt only. */
export function deriveMetaDescription(excerpt: string): string {
  return softTruncate(excerpt, META_DESCRIPTION_MAX);
}

export type BlogSeoMetaInput = {
  title: string;
  excerpt: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
};

export type BlogSeoMetaPatch = {
  metaTitle?: string;
  metaDescription?: string;
};

/**
 * Returns only fields that are blank and can be filled safely.
 * Never overwrites non-empty custom meta.
 */
export function buildEmptyMetaPatch(
  post: BlogSeoMetaInput,
): BlogSeoMetaPatch {
  const patch: BlogSeoMetaPatch = {};
  if (!collapseWs(post.metaTitle ?? "")) {
    const next = deriveMetaTitle(post.title);
    if (next) patch.metaTitle = next;
  }
  if (!collapseWs(post.metaDescription ?? "")) {
    const next = deriveMetaDescription(post.excerpt);
    if (next) patch.metaDescription = next;
  }
  return patch;
}
