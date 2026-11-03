import type { Metadata } from "next";
import { SolutionsSection } from "@/components/solutions-section";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { solutionsPageHeader } from "@/lib/solutions";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Solutions",
  description: solutionsPageHeader.subtitle,
  path: routes.solutions,
});

export default function SolutionsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Solutions", path: routes.solutions },
        ])}
      />
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            Our{" "}
            <span className="text-brand-600">Solutions</span>
          </>
        }
        description={solutionsPageHeader.subtitle}
      />
      <SolutionsSection showHeader={false} className="border-t-0 bg-transparent" />
      <CtaSection
        heading={
          <>
            Need a solution{" "}
            <span className="underline-signal">like these?</span>
          </>
        }
        subheading="Describe the workflow that slows your team down — we'll map the simplest path. Free consultation, no obligation."
        primaryLabel="Get a free consult"
        location="cta_section:solutions"
      />
    </>
  );
}
