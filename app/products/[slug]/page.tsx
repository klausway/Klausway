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
        eyebrow="Klaus Way Products"
        title={product.name}
        description={product.tagline}
      />
      <ProductDetail product={product} />
      <CtaSection />
    </>
  );
}
