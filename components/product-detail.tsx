import { ArrowRight, CircleCheck, ExternalLink } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { ProductTour } from "./product-tour";
import { TrackedLink } from "./tracked-link";
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
                    className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-xs font-medium text-muted-foreground"
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
  const demoContactHref = `${routes.contact}?product=${product.id}&intent=demo`;
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-border pt-8">
      {product.demoUrl ? (
        <TrackedLink
          href={product.demoUrl}
          external
          target="_blank"
          rel="noopener noreferrer"
          event="demo_request"
          eventParams={{ product: product.id, type: "live_demo" }}
          className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
        >
          Try the live demo
          <ExternalLink className="h-4 w-4" />
        </TrackedLink>
      ) : null}
      <TrackedLink
        href={demoContactHref}
        event="demo_request"
        eventParams={{ product: product.id, type: "contact" }}
        className="group inline-flex items-center gap-2 rounded-xl border border-border bg-surface-2 px-6 py-3 text-sm font-semibold transition-colors hover:border-border-strong"
      >
        {product.demoUrl ? "Talk to us about " : "Request a demo of "}
        {product.name}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </TrackedLink>
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
      className="h-full rounded-3xl border border-border bg-card p-6 shadow-card md:p-8"
    >
      <h2 className="font-display text-lg font-bold tracking-tight md:text-xl">{title}</h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90 md:text-base"
          >
            <CircleCheck
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                checkmark ? "text-signal-ink" : "text-brand-600",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
