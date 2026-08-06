import type { Metadata } from "next";
import { ResourcesGrid } from "@/components/blog-grid";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { resourcesPageHeader } from "@/lib/blog";
import { getPublishedResourcePosts } from "@/lib/blog-data";
import { routes } from "@/lib/navigation";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  siteConfig,
} from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Resources",
  description: resourcesPageHeader.subtitle,
  path: routes.resources,
});

export default async function ResourcesPage() {
  const posts = await getPublishedResourcePosts();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: routes.home },
            { name: "Resources", path: routes.resources },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${siteConfig.name} Resources`,
            description: resourcesPageHeader.subtitle,
            url: absoluteUrl(routes.resources),
            publisher: {
              "@type": "Organization",
              name: siteConfig.name,
              url: absoluteUrl("/"),
            },
          },
        ]}
      />
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            Our{" "}
            <span className="text-brand-600">Resources</span>
          </>
        }
        description={resourcesPageHeader.subtitle}
      />
      <ResourcesGrid posts={posts} hideHeader />
      <CtaSection
        heading={
          <>
            Reading about it is free.{" "}
            <span className="underline-signal">So is asking us.</span>
          </>
        }
        subheading="Skip the research rabbit hole — describe your situation and we'll tell you what we'd actually do."
        primaryLabel="Ask us directly"
        location="cta_section:resources"
      />
    </>
  );
}
