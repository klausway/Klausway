import { ArrowRight, CircleCheck } from "lucide-react";
import { HeroShowcase } from "./hero-showcase";
import { AmbientBackground } from "./animation/ambient-background";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import { featuredProducts } from "@/lib/featured-products";
import { klausConnectUrl, routes } from "@/lib/navigation";

export function Hero() {
  return (
    <section className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AmbientBackground variant="hero" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-600 animate-fade-up">
            Klaus Way
          </p>

          <h1
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl animate-fade-up-stagger"
            style={{ animationDelay: "100ms" }}
          >
            <span className="block">We build.</span>
            <span className="block">We connect.</span>
            <span className="block underline-signal text-brand-600">
              We simplify.
            </span>
          </h1>

          <p
            className="mx-auto mt-7 max-w-xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-up-stagger"
            style={{ animationDelay: "250ms" }}
          >
            Purpose-built technology for the way your business works.
            <br className="hidden sm:block" />
            Start with a{" "}
            <span className="font-medium text-foreground">free consultation</span>
            .
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up-stagger"
            style={{ animationDelay: "400ms" }}
          >
            <TrackedLink
              href={routes.contact}
              event="cta_click"
              eventParams={{ location: "hero" }}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Get a free consult
              <ButtonArrow />
            </TrackedLink>
            <TrackedLink
              href={klausConnectUrl}
              external
              target="_blank"
              rel="noopener noreferrer"
              event="cta_click"
              eventParams={{ location: "hero", product: "klaus_connect" }}
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              Visit Klaus Connect
              <ArrowRight className="h-4 w-4" />
            </TrackedLink>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground animate-fade-up-stagger"
            style={{ animationDelay: "550ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-signal-ink" />
              {featuredProducts.length} products in production
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-signal-ink" />
              Direct line to the people who build it
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-signal-ink" />
              North Windham, CT — (860) 400-0758
            </span>
          </div>
        </div>

        <div
          className="relative mt-20 animate-fade-up-stagger md:mt-24"
          style={{ animationDelay: "700ms" }}
        >
          <HeroShowcase />
        </div>
      </div>
    </section>
  );
}
