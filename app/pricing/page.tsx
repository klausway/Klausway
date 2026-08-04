import type { Metadata } from "next";
import { PricingCompare } from "@/components/pricing-compare";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Portal Access & Pricing",
  description:
    "Modular Klaus Way portal plans — Core, Automation, and Enterprise. Single sign-on across all 9 apps.",
  path: routes.pricing,
});

export default function PricingPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Pricing", path: routes.pricing },
        ])}
      />
      <PageHeader
        eyebrow="Portal Access"
        title={
          <>
            Plans built for{" "}
            <span className="text-gradient-animated">how you work</span>
          </>
        }
        description="Stop paying for disconnected tools. Access the full Klaus Way ecosystem with modular plans — add only the apps your business needs."
      />
      <PricingCompare hideHeader />
      <CtaSection />
    </>
  );
}
