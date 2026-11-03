import { Hero } from "@/components/hero";
import { HomeProducts } from "@/components/home-products";
import { SolutionsSection } from "@/components/solutions-section";
import { IntegrationsSection } from "@/components/integrations-section";
import { TrustedBySection } from "@/components/trusted-by-section";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd } from "@/lib/seo";

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([{ name: "Home", path: routes.home }])}
      />
      <Hero />
      <HomeProducts />
      <SolutionsSection compact limit={6} />
      <IntegrationsSection />
      <TrustedBySection />
      <CtaSection location="cta_section:home" />
    </>
  );
}
