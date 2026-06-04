import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { PipelineVisual } from "./feature-visuals/pipeline-visual";
import { AiCopilotVisual } from "./feature-visuals/ai-copilot-visual";
import { AutomationVisual } from "./feature-visuals/automation-visual";
import { AnalyticsVisual } from "./feature-visuals/analytics-visual";
import { InboxVisual } from "./feature-visuals/inbox-visual";
import { MobileVisual } from "./feature-visuals/mobile-visual";
import type { PortfolioProject } from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const visualMap: Record<string, ComponentType> = {
  crm: PipelineVisual,
  "lead-pipeline": PipelineVisual,
  "voice-ai-agent": AiCopilotVisual,
  "quickbooks-payment": AnalyticsVisual,
  "report-generator": AnalyticsVisual,
  "detailed-reporting": AnalyticsVisual,
  "upload-file": InboxVisual,
  "customer-e-signing": InboxVisual,
  "inventory-management": AutomationVisual,
  "vehicle-tracking": MobileVisual,
};

type HomeProductsProps = {
  projects: PortfolioProject[];
};

export function HomeProducts({ projects }: HomeProductsProps) {
  return (
    <section id="products" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Our Products
          </div>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Custom-built systems
            <br />
            <span className="text-gradient-animated">for every part of your business</span>
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Each application is designed, built, and deployed as its own standalone
            solution — from CRM and reporting to payments, inventory, and AI.
          </p>
        </Reveal>

        <div className="mt-20 space-y-32">
          {projects.map((project, i) => (
            <ProductRow key={project.id} project={project} reverse={i % 2 === 1} />
          ))}
        </div>

        <Reveal className="mt-20 text-center">
          <Link
            href={routes.portfolio}
            className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
          >
            View full portfolio
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

type ProductRowProps = {
  project: PortfolioProject;
  reverse: boolean;
};

function ProductRow({ project, reverse }: ProductRowProps) {
  const Visual = visualMap[project.id] ?? AnalyticsVisual;
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
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
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
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-lime-400" />
              {feature}
            </li>
          ))}
        </ul>
        <Link
          href={`${routes.portfolio}/${project.id}`}
          className="group/link mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 transition-colors hover:text-brand-200"
        >
          Learn more about {project.title}
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <div
          className={cn(
            "absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br opacity-20 blur-2xl",
            project.accent,
          )}
        />
        <Visual />
      </Reveal>
    </div>
  );
}
