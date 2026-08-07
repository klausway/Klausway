import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { BrowserFrame } from "./ui/browser-frame";
import {
  getPortfolioScreenshot,
  getPortfolioVisual,
} from "./portfolio-media";
import type { PortfolioProject } from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type HomeProductsProps = {
  projects: PortfolioProject[];
};

export function HomeProducts({ projects }: HomeProductsProps) {
  return (
    <section id="products" className="relative border-y border-border bg-card py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="What we build"
          title={
            <>
              Custom-built systems for{" "}
              <span className="text-brand-600">every part of your business</span>
            </>
          }
          description="Each application is designed, built, and deployed as its own standalone solution — from CRM and reporting to payments, inventory, and AI."
          aside={
            <Link
              href={routes.portfolio}
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              View full portfolio
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          }
        />

        <div className="mt-20 space-y-24">
          {projects.map((project, i) => (
            <ProductRow
              key={project.id}
              project={project}
              index={i}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProductRowProps = {
  project: PortfolioProject;
  index: number;
  reverse: boolean;
};

function ProductRow({ project, index, reverse }: ProductRowProps) {
  const image =
    getPortfolioScreenshot(project.id) ??
    (project.coverImage
      ? {
          src: project.coverImage,
          url: project.title,
          alt: `${project.title} screenshot`,
        }
      : undefined);
  const Visual = getPortfolioVisual(project.id);
  const highlights = project.keyFeatures.slice(0, 4);

  return (
    <div
      id={project.id}
      className={cn(
        "scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "lg:[&>div:first-child]:order-2",
      )}
    >
      <Reveal as="div" delay={100}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-semibold tracking-widest text-brand-600">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden className="mr-1 h-px w-6 bg-border-strong" />
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-balance font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {project.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {project.overview}
        </p>
        <ul className="mt-6 space-y-2.5">
          {highlights.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm text-foreground/90"
            >
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" />
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href={`${routes.portfolio}/${project.id}`}
          className="group/link mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Learn more about {project.title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-border p-4 sm:p-6">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-[0.08]",
              project.accent,
            )}
          />
          <div
            className={cn(
              "absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
              project.accent,
            )}
          />
          <div className="relative">
            {image ? (
              <BrowserFrame src={image.src} alt={image.alt} url={image.url} />
            ) : (
              <Visual />
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
