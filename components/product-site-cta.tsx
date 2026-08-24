import { ArrowRight, ExternalLink } from "lucide-react";
import { TrackedLink } from "./tracked-link";

const linkClass =
  "group/link inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700";

type ProductSiteCtaProps = {
  name: string;
  productId: string;
  productUrl?: string;
  fallbackHref: string;
  fallbackLabel: string;
  location: string;
};

/** Primary outbound product-site link, with an optional in-site fallback. */
export function ProductSiteCta({
  name,
  productId,
  productUrl,
  fallbackHref,
  fallbackLabel,
  location,
}: ProductSiteCtaProps) {
  const outboundLabel = productUrl ? `Visit ${name}` : fallbackLabel;
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
      {productUrl ? (
        <TrackedLink
          href={productUrl}
          external
          target="_blank"
          rel="noopener noreferrer"
          event="cta_click"
          eventParams={{ location, product: productId, type: "product_site" }}
          className={linkClass}
        >
          {outboundLabel}
          <ExternalLink className="h-3.5 w-3.5" />
        </TrackedLink>
      ) : null}
      <TrackedLink
        href={fallbackHref}
        event="cta_click"
        eventParams={{ location, product: productId, type: "internal" }}
        className={linkClass}
      >
        {productUrl ? fallbackLabel : outboundLabel}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
      </TrackedLink>
    </div>
  );
}
