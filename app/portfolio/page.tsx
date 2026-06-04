import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { portfolioPageHeader } from "@/lib/portfolio";
import { getPublishedPortfolioProjects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Portfolio",
  description: portfolioPageHeader.subtitle,
};

export default async function PortfolioPage() {
  const projects = await getPublishedPortfolioProjects();

  return (
    <>
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            Our{" "}
            <span className="text-gradient-animated">Portfolio</span>
          </>
        }
        description={portfolioPageHeader.subtitle}
      />
      <PortfolioGrid projects={projects} hideHeader />
      <CtaSection />
    </>
  );
}
