import Link from "next/link";
import { ArrowRight, CircleCheck, ExternalLink } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { ProductTour } from "./product-tour";
import {
  ContentDetailArticle,
  ContentDetailMeta,
  ContentDetailShell,
} from "./content-detail-shell";
import type { FeaturedProduct } from "@/lib/featured-products";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ProductDetailProps = {
  product: FeaturedProduct;
};

export function ProductDetail({ product }: ProductDetailProps) {
  return (
    <ContentDetailShell backHref={routes.products} backLabel="Back to Products">
      <ProductTour
        productName={product.name}
        steps={product.tour}
        accent={product.accent}
      />

      <ContentDetailMeta
        items={[
          {
            label: "Tags",
            value: (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-black/10 bg-black/[0.03] px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ),
          },
          { label: "Screens", value: `${product.tour.length} in this tour` },
        ]}
      />

      <ContentDetailArticle>
        <p className="text-base leading-[1.85] text-foreground/90 md:text-lg">
          {product.overview}
        </p>
        <DemoCta product={product} />
      </ContentDetailArticle>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <DetailBlock title="Key Features" items={product.features} delay={200} />
        <DetailBlock title="Benefits" items={product.benefits} delay={300} />
        <DetailBlock title="Use Cases" items={product.useCases} delay={400} checkmark />
      </div>
    </ContentDetailShell>
  );
}

function DemoCta({ product }: { product: FeaturedProduct }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-black/10 pt-8">
      {product.demoUrl ? (
        <a
          href={product.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5"
        >
          Try the live demo
          <ExternalLink className="h-4 w-4" />
        </a>
      ) : null}
      <Link
        href={routes.contact}
        className="group inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-6 py-3 text-sm font-semibold transition-all hover:border-black/15 hover:bg-black/[0.06]"
      >
        {product.demoUrl ? "Talk to us about " : "Request a demo of "}
        {product.name}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}

function DetailBlock({
  title,
  items,
  delay,
  checkmark = false,
}: {
  title: string;
  items: string[];
  delay: 0 | 100 | 200 | 300 | 400;
  checkmark?: boolean;
}) {
  return (
    <Reveal
      delay={delay}
      className="h-full rounded-3xl border border-black/10 bg-card/30 p-6 backdrop-blur-sm md:p-8"
    >
      <h2 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90 md:text-base"
          >
            <CircleCheck
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                checkmark ? "text-lime-600" : "text-brand-600",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
