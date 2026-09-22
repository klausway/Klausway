import type { Metadata } from "next";
import { IntegrationsHero } from "@/components/integrations-hero";
import { IntegrationsDirectory } from "@/components/integrations-directory";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { integrationsPageHeader } from "@/lib/integrations";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Integrations",
  description: integrationsPageHeader.description,
  path: routes.integrations,
});

export default function IntegrationsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Integrations", path: routes.integrations },
        ])}
      />
      <IntegrationsHero />
      <IntegrationsDirectory />
      <CtaSection
        heading={
          <>
            Already paying for it?
            <br />
            <span className="underline-signal">Let's connect it.</span>
          </>
        }
        subheading="Tell us which systems your team lives in and we'll show you how they fit together in one build."
        primaryLabel="Book a 30-minute call"
        secondaryLabel="See our products"
        proofPoints={[
          "Enabled per company",
          "Runs on your own accounts",
          "Built in, not billed as a change order",
        ]}
        location="cta_section:integrations"
      />
    </>
  );
}
