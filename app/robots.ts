import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const disallowPrivate = ["/admin/", "/api/"] as const;

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();
  return {
    rules: [
      {
        // OpenAI search / answer retrieval — keep public pages crawlable.
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: [...disallowPrivate],
      },
      {
        userAgent: "*",
        allow: "/",
        disallow: [...disallowPrivate],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
