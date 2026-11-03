import Link from "next/link";
import { ArrowRight, CircleCheck, Images } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { BrowserFrame } from "./ui/browser-frame";
import { ProductSiteCta } from "./product-site-cta";
import {
  featuredProducts,
  type FeaturedProduct,
} from "@/lib/featured-products";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const HOME_PRODUCT_LIMIT = 3;

export function HomeProducts() {
  const products = featuredProducts.slice(0, HOME_PRODUCT_LIMIT);

  return (
    <section id="products" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Products"
          title={
            <>
              Software we design, ship,{" "}
              <span className="text-brand-600">and run in production</span>
            </>
          }
          description="Packaged platforms you can try today — led by Klaus Connect, plus restaurant ordering, dispatch, AI, spend, and compliance."
          aside={
            <Link
              href={routes.products}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              View all products
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />

        <div className="mt-20 space-y-24">
          {products.map((product, i) => (
            <ProductRow
              key={product.id}
              product={product}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductRow({
  product,
  reverse,
}: {
  product: FeaturedProduct;
  reverse: boolean;
}) {
  return (
    <div
      id={product.id}
      className={cn(
        "scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "lg:[&>div:first-child]:order-2",
      )}
    >
      <Reveal as="div" delay={100}>
        <div className="flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-balance font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {product.name}
        </h3>
        <p className="mt-2 text-sm font-medium text-brand-600">
          {product.tagline}
        </p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <ul className="mt-6 space-y-2.5">
          {product.features.slice(0, 4).map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-foreground/90"
            >
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" />
              {feature}
            </li>
          ))}
        </ul>
        <ProductSiteCta
          name={product.name}
          productId={product.id}
          productUrl={product.productUrl}
          fallbackHref={`${routes.products}/${product.id}`}
          fallbackLabel={
            product.productUrl
              ? "Take the product tour"
              : `Explore ${product.name}`
          }
          location="home_products"
        />
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <div
          className={cn(
            "absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br opacity-10 blur-2xl",
            product.accent,
          )}
        />
        <Link
          href={`${routes.products}/${product.id}`}
          aria-label={`Explore ${product.name}`}
          className="group/shot relative block transition-transform duration-300 hover:-translate-y-1"
        >
          <BrowserFrame
            src={product.image}
            alt={product.imageAlt}
            url={product.name}
          />
          <span className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/shot:opacity-100" />
          <span className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/shot:opacity-100">
            <Images className="h-3.5 w-3.5" />
            {product.tour.length} screens — take the tour
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
