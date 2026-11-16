import type { Metadata } from "next";
import { FeaturedProductsSection } from "@/components/featured-products-section";
import { PageHeader } from "@/components/page-header";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { productsPageHeader } from "@/lib/featured-products";
import { productsFaqs } from "@/lib/faqs";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Products",
  description: productsPageHeader.subtitle,
  path: routes.products,
});

export default function ProductsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "Products", path: routes.products },
        ])}
      />
      <PageHeader
        eyebrow="Klaus Way Products"
        title={
          <>
            Our{" "}
            <span className="text-brand-600">Products</span>
          </>
        }
        description={productsPageHeader.subtitle}
      />
      <FeaturedProductsSection />
      <FaqSection group={productsFaqs} />
      <CtaSection
        heading={
          <>
            See one you&apos;d like{" "}
            <span className="underline-signal">to try?</span>
          </>
        }
        subheading="Every product here is running in production today. Book a demo and we'll walk you through it on a live screen share."
        primaryLabel="Book a demo"
        location="cta_section:products"
      />
    </>
  );
}
