import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { portfolioPageHeader } from "@/lib/portfolio";
import { getPublishedPortfolioProjects } from "@/lib/portfolio-data";
import { routes } from "@/lib/navigation";
import { absoluteUrl, breadcrumbJsonLd, buildPageMetadata, siteConfig } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Portfolio",
  description: portfolioPageHeader.subtitle,
  path: routes.portfolio,
});

export default async function PortfolioPage() {
  const projects = await getPublishedPortfolioProjects();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: routes.home },
            { name: "Portfolio", path: routes.portfolio },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${siteConfig.name} Portfolio`,
            description: portfolioPageHeader.subtitle,
            url: absoluteUrl(routes.portfolio),
          },
        ]}
      />
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            Our{" "}
            <span className="text-brand-600">Portfolio</span>
          </>
        }
        description={portfolioPageHeader.subtitle}
      />
      <PortfolioGrid projects={projects} />
      <CtaSection
        heading={
          <>
            Have a similar problem?{" "}
            <span className="underline-signal">We&apos;ve probably built something close.</span>
          </>
        }
        subheading="Tell us what you're wrestling with — chances are one of these systems already solves most of it."
        primaryLabel="Tell us about it"
        location="cta_section:portfolio"
      />
    </>
  );
}
