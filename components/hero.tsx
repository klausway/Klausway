import Link from "next/link";
import { ArrowRight, Sparkles, CircleCheck } from "lucide-react";
import { ShowcaseDashboardAll } from "./showcase-dashboard-all";
import { AmbientBackground } from "./animation/ambient-background";
import type { PortfolioProject } from "@/lib/portfolio";
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
        <div className="dot-pattern mask-fade-bottom absolute inset-0 -z-10 opacity-40" />
      </div>

      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            href={routes.portfolio}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur transition-all hover:scale-[1.02] hover:border-white/20 hover:bg-white/10 hover:text-foreground animate-fade-up"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-lime-400/70 animate-ping-soft" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]" />
            </span>
            Powering what&apos;s next for the business
            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <h1
            className="mt-8 text-balance text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl animate-fade-up-stagger"
            style={{ animationDelay: "100ms" }}
          >
            Custom applications
            <br />
            <span className="text-gradient-animated">built for how you work</span>
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-up-stagger"
            style={{ animationDelay: "250ms" }}
          >
            Standalone systems for CRM, reporting, payments, inventory, e-signing,
            fleet tracking, and AI — each tailored to your business, not bundled
            into one generic platform.
          </p>

          <div
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up-stagger"
            style={{ animationDelay: "400ms" }}
          >
            <Link
              href={routes.contact}
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-black transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/20 active:scale-100"
            >
              Get a Free Consultation
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#products"
              className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
            >
              <Sparkles className="h-4 w-4 text-brand-300 transition-transform group-hover:rotate-12" />
              Explore our products
            </Link>
          </div>

          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground animate-fade-up-stagger"
            style={{ animationDelay: "550ms" }}
          >
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-lime-400" />
              {projects.length} standalone systems
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-lime-400" />
              24/7 expert support
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-lime-400" />
              Enterprise-grade security
            </span>
          </div>
        </div>

        <div
          className="relative mt-20 overflow-visible animate-fade-up-stagger"
          style={{ animationDelay: "700ms" }}
        >
          <div className="absolute -inset-x-20 -top-10 -bottom-10 -z-10 bg-radial-glow blur-3xl" />
          <ShowcaseDashboardAll />
        </div>

        <ProductGridLinks projects={projects} />
      </div>
    </section>
  );
}

function ProductGridLinks({ projects }: { projects: PortfolioProject[] }) {
  return (
    <div className="mx-auto mt-20 grid max-w-5xl grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {projects.map((project, i) => (
        <Link
          key={project.id}
          href={`#${project.id}`}
          className="hover-lift group relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] px-3 py-3 transition-all hover:border-white/10 hover:bg-white/[0.04] animate-fade-up-stagger"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span
            className={cn(
              "absolute inset-x-0 -bottom-px h-px bg-gradient-to-r opacity-0 transition-opacity group-hover:opacity-100",
              project.accent,
            )}
          />
          <span className="line-clamp-2 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            {project.title}
          </span>
        </Link>
      ))}
    </div>
  );
}
