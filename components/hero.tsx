import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { HeroShowcase } from "./hero-showcase";
import { AmbientBackground } from "./animation/ambient-background";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import type { PortfolioProject } from "@/lib/portfolio";
import { featuredProducts } from "@/lib/featured-products";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type HeroProps = {
  projects: PortfolioProject[];
};

export function Hero({ projects = [] }: HeroProps) {
  return (
    <section className="relative pt-32 pb-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AmbientBackground variant="hero" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href={routes.products}
            className="group inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-600 transition-colors hover:text-brand-700 animate-fade-up"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 bg-signal/70 animate-ping-soft" />
              <span className="relative h-1.5 w-1.5 bg-signal" />
            </span>
            {featuredProducts.length} products in production — see them
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1
            className="mt-8 text-balance font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl animate-fade-up-stagger"
            style={{ animationDelay: "100ms" }}
          >
            Software built around
            <br />
            how your business{" "}
            <span className="underline-signal text-brand-600">actually runs</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-up-stagger"
            style={{ animationDelay: "250ms" }}
          >
            We started by building CRMs for roofing companies. Today our team
            designs, ships, and runs complete systems — CRM, dispatch, payments,
            compliance, and voice AI — for businesses that outgrew spreadsheets
            and one-size-fits-all tools.
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
              Book a free 30-minute consult
              <ButtonArrow />
            </TrackedLink>
            <Link
              href="#products"
              className={buttonVariants({ variant: "secondary", size: "lg" })}
            >
              See what we build
            </Link>
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
          className="relative mt-24 animate-fade-up-stagger"
          style={{ animationDelay: "700ms" }}
        >
          <div className="absolute -inset-x-20 -top-10 -bottom-10 -z-10 bg-radial-glow blur-3xl" />
          <HeroShowcase />
        </div>

        <ProductGridLinks projects={projects} />
      </div>
    </section>
  );
}

function ProductGridLinks({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="mx-auto mt-24 grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {projects.map((project, i) => (
        <Link
          key={project.id}
          href={`#${project.id}`}
          className="hover-lift group relative overflow-hidden rounded-xl border border-border bg-card px-3 py-3 transition-colors hover:border-border-strong animate-fade-up-stagger"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span
            className={cn(
              "absolute inset-x-0 -bottom-px h-px bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
              project.accent,
            )}
          />
          <span className="line-clamp-2 font-mono text-[11px] font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            {project.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
