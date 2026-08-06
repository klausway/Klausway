import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { BrowserFrame } from "./ui/browser-frame";
import {
  getPortfolioScreenshot,
  getPortfolioVisual,
} from "./portfolio-media";
import type { PortfolioProject } from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type PortfolioGridProps = {
  projects: PortfolioProject[];
};

export function PortfolioGrid({ projects }: PortfolioGridProps) {
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="space-y-24">
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              reverse={i % 2 === 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProjectRowProps = {
  project: PortfolioProject;
  reverse: boolean;
};

function ProjectRow({ project, reverse }: ProjectRowProps) {
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

  return (
    <div
      id={project.id}
      className={cn(
        "scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16",
        reverse && "lg:[&>div:first-child]:order-2",
      )}
    >
      <Reveal as="div" delay={100}>
        <div className="flex flex-wrap gap-2">
          {project.categories.map((category) => (
            <span
              key={category}
              className="rounded-md border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {category}
            </span>
          ))}
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h2 className="mt-4 text-balance font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {project.title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {project.overview}
        </p>
        <ul className="mt-6 space-y-2.5">
          {project.keyFeatures.map((feature) => (
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
          View full project
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <div
          className={cn(
            "absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br opacity-10 blur-2xl",
            project.accent,
          )}
        />
        {image ? (
          <Link
            href={`${routes.portfolio}/${project.id}`}
            aria-label={`View ${project.title}`}
            className="group/shot relative block transition-transform duration-300 hover:-translate-y-1"
          >
            <BrowserFrame src={image.src} alt={image.alt} url={image.url} />
            {(project.galleryImages?.length ?? 0) > 0 ? (
              <span className="pointer-events-none absolute bottom-4 left-4 rounded-md bg-black/65 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover/shot:opacity-100">
                {(project.galleryImages?.length ?? 0) + 1} screens — see the
                gallery
              </span>
            ) : null}
          </Link>
        ) : (
          <Visual />
        )}
      </Reveal>
    </div>
  );
}
