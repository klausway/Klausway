import type { Metadata } from "next";
import { ServicesSection } from "@/components/services-section";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { servicesPageHeader } from "@/lib/services";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Our Services",
  description: servicesPageHeader.subtitle,
  path: routes.apps,
});

export default function AppsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Services", path: routes.apps },
        ])}
      />
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            Our{" "}
            <span className="text-gradient-animated">Services</span>
          </>
        }
        description={servicesPageHeader.subtitle}
      />
      <ServicesSection showHeader={false} />
      <CtaSection />
    </>
  );
}
