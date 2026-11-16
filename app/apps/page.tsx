import type { Metadata } from "next";
import { ServicesSection } from "@/components/services-section";
import { PageHeader } from "@/components/page-header";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { servicesFaqs } from "@/lib/faqs";
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
        eyebrow="Klaus Way Services"
        title={
          <>
            Our{" "}
            <span className="text-brand-600">Services</span>
          </>
        }
        description={servicesPageHeader.subtitle}
      />
      <ServicesSection showHeader={false} />
      <FaqSection group={servicesFaqs} />
      <CtaSection
        heading={
          <>
            Not sure which service{" "}
            <span className="underline-signal">you need?</span>
          </>
        }
        subheading="That's normal — most projects touch a few. Describe the problem and we'll map out the simplest path — free consultation, no obligation."
        primaryLabel="Book a free consult"
        location="cta_section:services"
      />
    </>
  );
}
