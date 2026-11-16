import { Hero } from "@/components/hero";
import { HomeProducts } from "@/components/home-products";
import { SolutionsHelpSection } from "@/components/solutions-help-section";
import { IntegrationsSection } from "@/components/integrations-section";
import { TrustedBySection } from "@/components/trusted-by-section";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { homeFaqs } from "@/lib/faqs";
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
      <SolutionsHelpSection showViewAll />
      <IntegrationsSection />
      <TrustedBySection />
      <FaqSection group={homeFaqs} />
      <CtaSection location="cta_section:home" />
    </>
  );
}
