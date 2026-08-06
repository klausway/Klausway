import { CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import { routes } from "@/lib/navigation";

type CtaSectionProps = {
  heading?: React.ReactNode;
  subheading?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  proofPoints?: string[];
  /** GA4 cta_click location param, e.g. "cta_section:home". */
  location?: string;
};

const defaultProofPoints = [
  "7 products in production",
  "Direct line to the people who build it",
  "North Windham, CT — (860) 400-0758",
];

export function CtaSection({
  heading = (
    <>
      Stop fighting
      <br />
      <span className="underline-signal">your software.</span>
    </>
  ),
  subheading = "Tell us how your business runs — we'll show you what we'd build. Free 30-minute call, no obligation.",
  primaryLabel = "Book a free consult",
  primaryHref = routes.contact,
  secondaryLabel = "See our products",
  secondaryHref = routes.products,
  proofPoints = defaultProofPoints,
  location = "cta_section",
}: CtaSectionProps) {
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 bg-[size:32px_32px] opacity-60" />
        <div className="absolute -top-32 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/15 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-4xl px-6">
        <Reveal as="div" className="text-center">
          <h2 className="text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl">
            {heading}
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-balance text-base text-ink-foreground/70">
            {subheading}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <TrackedLink
              href={primaryHref}
              event="cta_click"
              eventParams={{ location, label: primaryLabel }}
              className={buttonVariants({ variant: "onDark" })}
            >
              {primaryLabel}
              <ButtonArrow />
            </TrackedLink>
            <TrackedLink
              href={secondaryHref}
              event="cta_click"
              eventParams={{ location, label: secondaryLabel }}
              className={buttonVariants({
                variant: "secondary",
                className:
                  "border-white/15 bg-white/5 text-ink-foreground hover:border-white/30 hover:bg-white/10",
              })}
            >
              {secondaryLabel}
            </TrackedLink>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-foreground/60">
            {proofPoints.map((point) => (
              <span key={point} className="inline-flex items-center gap-1.5">
                <CircleCheck className="h-3.5 w-3.5 text-signal" />
                {point}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
