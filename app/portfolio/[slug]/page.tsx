import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PortfolioDetail } from "@/components/portfolio-detail";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { getPortfolioProject } from "@/lib/portfolio-data";
import { routes } from "@/lib/navigation";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  portfolioProjectJsonLd,
} from "@/lib/seo";

type PortfolioProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PortfolioProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) return { title: "Project Not Found", robots: { index: false } };
  return buildPageMetadata({
    title: project.title,
    description: project.overview,
    path: `${routes.portfolio}/${project.id}`,
    image: project.coverImage,
  });
}

export default async function PortfolioProjectPage({
  params,
}: PortfolioProjectPageProps) {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: routes.home },
            { name: "Portfolio", path: routes.portfolio },
            {
              name: project.title,
              path: `${routes.portfolio}/${project.id}`,
            },
          ]),
          portfolioProjectJsonLd(project),
        ]}
      />
      <PageHeader
        wide
        eyebrow="Portfolio"
        title={project.title}
        description={project.description}
      />
      <PortfolioDetail project={project} />
      <CtaSection
        heading={
          <>
            Need something{" "}
            <span className="underline-signal">like this?</span>
          </>
        }
        subheading="We've built it before — tell us how your version needs to work and we'll show you what we'd do."
        primaryLabel="Start a conversation"
        location="cta_section:portfolio_detail"
      />
    </>
  );
}
