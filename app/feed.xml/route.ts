import { getPublishedResourcePosts } from "@/lib/blog-data";
import { resourcesPageHeader, resourceTypeLabels } from "@/lib/blog";
import { routes } from "@/lib/navigation";
import { absoluteImageUrl, absoluteUrl, feedUrl, siteConfig } from "@/lib/seo";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rssDate(isoDate: string): string {
  return new Date(`${isoDate}T12:00:00Z`).toUTCString();
}

/** RSS 2.0 feed of published resources (articles, guides, news, case studies). */
export async function GET() {
  const posts = await getPublishedResourcePosts();
  const resourcesUrl = absoluteUrl(routes.resources);
  const lastBuild = posts[0]
    ? rssDate(posts[0].updatedAt ?? posts[0].date)
    : new Date().toUTCString();

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`${routes.resources}/${post.slug}`);
      const description = post.metaDescription?.trim() || post.excerpt;
      const image = post.ogImage?.trim() || post.coverImage;
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(url)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
        `      <pubDate>${rssDate(post.date)}</pubDate>`,
        `      <category>${escapeXml(resourceTypeLabels[post.type])}</category>`,
        `      <description>${escapeXml(description)}</description>`,
        image
          ? `      <media:content url="${escapeXml(absoluteImageUrl(image))}" medium="image" />`
          : null,
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(`${siteConfig.name} Resources`)}</title>
    <link>${escapeXml(resourcesUrl)}</link>
    <description>${escapeXml(resourcesPageHeader.subtitle)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl())}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
