import Link from "next/link";
import { ArrowRight, CircleCheck, Images } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { featuredProducts, type FeaturedProduct } from "@/lib/featured-products";
import { assetPath } from "@/lib/asset-path";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function FeaturedProductsSection() {
  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="space-y-32">
          {featuredProducts.map((product, i) => (
            <ProductRow key={product.id} product={product} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProductRowProps = {
  product: FeaturedProduct;
  reverse: boolean;
};

function ProductRow({ product, reverse }: ProductRowProps) {
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
              className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {product.name}
        </h2>
        <p className="mt-2 text-sm font-medium text-brand-600">{product.tagline}</p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {product.description}
        </p>
        <ul className="mt-6 space-y-2.5">
          {product.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-foreground/90"
            >
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-600" />
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href={`${routes.products}/${product.id}`}
          className="group/link mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-600"
        >
          Explore {product.name}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <div
          className={cn(
            "absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br opacity-20 blur-2xl",
            product.accent,
          )}
        />
        <Link
          href={`${routes.products}/${product.id}`}
          aria-label={`Explore ${product.name}`}
          className="group/shot relative block overflow-hidden rounded-2xl border border-black/[0.08] bg-card/40 shadow-xl transition-transform duration-300 hover:-translate-y-1"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(product.image)}
            alt={product.imageAlt}
            className="w-full object-cover"
            loading="lazy"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/shot:opacity-100" />
          <span className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/shot:opacity-100">
            <Images className="h-3.5 w-3.5" />
            {product.tour.length} screens — take the tour
          </span>
        </Link>
      </Reveal>
    </div>
  );
}
