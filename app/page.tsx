import { Hero } from "@/components/hero";
import { HomeProducts } from "@/components/home-products";
import { ProcessSection } from "@/components/process-section";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { getPublishedPortfolioProjects } from "@/lib/portfolio-data";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const projects = await getPublishedPortfolioProjects();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: routes.home }])}
      />
      <Hero projects={projects} />
      <HomeProducts projects={projects} />
      <ProcessSection />
      <CtaSection location="cta_section:home" />
    </>
  );
}
