import { Hero } from "@/components/hero";
import { HomeProducts } from "@/components/home-products";
import { CtaSection } from "@/components/cta-section";
import { getPublishedPortfolioProjects } from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getPublishedPortfolioProjects();

  return (
    <>
      <Hero projects={projects} />
      <HomeProducts projects={projects} />
      <CtaSection />
    </>
  );
}
