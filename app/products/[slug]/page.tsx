import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { ProductDetail } from "@/components/product-detail";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { featuredProducts, getFeaturedProduct } from "@/lib/featured-products";
import { routes } from "@/lib/navigation";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  softwareApplicationJsonLd,
} from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featuredProducts.map((product) => ({ slug: product.id }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getFeaturedProduct(slug);
  if (!product) return { title: "Product Not Found", robots: { index: false } };

  return buildPageMetadata({
    title: product.name,
    description: product.tagline,
    path: `${routes.products}/${product.id}`,
    image: product.image,
    canonicalUrl: product.productUrl,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getFeaturedProduct(slug);
  if (!product) notFound();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: routes.home },
            { name: "Products", path: routes.products },
            { name: product.name, path: `${routes.products}/${product.id}` },
          ]),
          softwareApplicationJsonLd(product),
        ]}
      />
      <PageHeader
        wide
        eyebrow={
          product.id === "worknex"
            ? "Klaus Way · Flagship product"
            : "Klaus Way Products"
        }
        title={product.name}
        description={
          product.productUrl
            ? `${product.tagline} The full product site is ${new URL(product.productUrl).hostname}.`
            : product.tagline
        }
      />
      <ProductDetail product={product} />
      <CtaSection
        heading={
          <>
            Want a walkthrough of{" "}
            <span className="underline-signal">{product.name}?</span>
          </>
        }
        subheading="30 minutes, screen share, real data. We'll show you exactly how it would work for your business."
        primaryLabel={product.productUrl ? `Visit ${product.name}` : "Book a demo"}
        primaryHref={
          product.productUrl ??
          `${routes.contact}?product=${product.id}&intent=demo`
        }
        secondaryLabel={product.productUrl ? "Book a demo" : "See the other products"}
        secondaryHref={
          product.productUrl
            ? `${routes.contact}?product=${product.id}&intent=demo`
            : routes.products
        }
        location={`cta_section:product:${product.id}`}
      />
    </>
  );
}
