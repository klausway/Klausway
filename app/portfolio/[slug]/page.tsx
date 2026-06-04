import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { PortfolioDetail } from "@/components/portfolio-detail";
import { CtaSection } from "@/components/cta-section";
import { getPortfolioProject } from "@/lib/portfolio-data";

type PortfolioProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: PortfolioProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.overview,
  };
}

export default async function PortfolioProjectPage({
  params,
}: PortfolioProjectPageProps) {
  const { slug } = await params;
  const project = await getPortfolioProject(slug);
  if (!project) notFound();

  return (
    <>
      <PageHeader
        wide
        eyebrow="Portfolio"
        title={project.title}
        description={project.description}
      />
      <PortfolioDetail project={project} />
      <CtaSection />
    </>
  );
}
