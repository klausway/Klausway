import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { BrowserFrame } from "./ui/browser-frame";
import {
  getPortfolioScreenshot,
  getPortfolioVisual,
} from "./portfolio-media";
import { solutions, type Solution } from "@/lib/solutions";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SolutionsSectionProps = {
  /** Limit cards; omit for the full /solutions list. */
  limit?: number;
  /** Compact card grid for the home page (no long alternating rows). */
  compact?: boolean;
  showHeader?: boolean;
  className?: string;
};

export function SolutionsSection({
  limit,
  compact = false,
  showHeader = true,
  className,
}: SolutionsSectionProps) {
  const items = limit ? solutions.slice(0, limit) : solutions;

  return (
    <section
      id="solutions"
      className={cn("relative border-y border-border bg-card py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-6">
        {showHeader ? (
          <SectionHeading
            align="left"
            eyebrow="Capabilities"
            title={
              <>
                Modules we design{" "}
                <span className="text-brand-600">into real operations</span>
              </>
            }
            description="From lead pipelines and reporting to payments, e-sign, and voice AI — the building blocks we ship so your team spends less time fighting tools."
            aside={
              compact || limit ? (
                <Link
                  href={routes.solutions}
                  className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
                >
                  View all solutions
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : undefined
            }
          />
        ) : null}

        {compact ? (
          <div
            className={cn(
              "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
              showHeader && "mt-12",
            )}
          >
            {items.map((solution, i) => (
              <Reveal
                key={solution.id}
                delay={((i % 3) * 100) as 0 | 100 | 200}
              >
                <SolutionCard solution={solution} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className={cn("space-y-24", showHeader && "mt-20")}>
            {items.map((solution, i) => (
              <SolutionRow
                key={solution.id}
                solution={solution}
                index={i}
                reverse={i % 2 === 1}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SolutionCard({ solution }: { solution: Solution }) {
  return (
    <Link
      href={`${routes.solutions}#${solution.id}`}
      className="hover-lift group flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-colors hover:border-border-strong"
    >
      <div
        className={cn(
          "mb-4 h-1 w-10 rounded-full bg-gradient-to-r",
          solution.accent,
        )}
      />
      <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-600">
        {solution.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
        {solution.description}
      </p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600">
        Learn more
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function SolutionRow({
  solution,
  index,
  reverse,
}: {
  solution: Solution;
  index: number;
  reverse: boolean;
}) {
  const image =
    getPortfolioScreenshot(solution.id) ??
    (solution.coverImage
      ? {
          src: solution.coverImage,
          url: solution.title,
          alt: `${solution.title} screenshot`,
        }
      : undefined);
  const Visual = getPortfolioVisual(solution.id);
  const highlights = solution.keyFeatures.slice(0, 4);

  return (
    <div
      id={solution.id}
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
          {solution.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-balance font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl">
          {solution.title}
        </h3>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {solution.overview}
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
          href={routes.contact}
          className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
        >
          Talk through this solution
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-border p-4 sm:p-6">
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-br opacity-[0.08]",
              solution.accent,
            )}
          />
          <div
            className={cn(
              "absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br opacity-20 blur-3xl",
              solution.accent,
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
