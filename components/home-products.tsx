import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { BrowserFrame } from "./ui/browser-frame";
import { AnalyticsVisual } from "./feature-visuals/analytics-visual";
import { FileUploadVisual } from "./feature-visuals/file-upload-visual";
import { EsignVisual } from "./feature-visuals/esign-visual";
import { InventoryVisual } from "./feature-visuals/inventory-visual";
import { TrackingVisual } from "./feature-visuals/tracking-visual";
import { VoiceAiVisual } from "./feature-visuals/voice-ai-visual";
import { ReportGeneratorVisual } from "./feature-visuals/report-generator-visual";
import { DetailedReportingVisual } from "./feature-visuals/detailed-reporting-visual";
import type { PortfolioProject } from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/* Real product screenshots where a project maps to shipped software;
   hand-built visuals remain only as fallback for the rest. */
const imageMap: Record<string, { src: string; url: string; alt: string }> = {
  crm: {
    src: "/products/klaus-connect.png",
    url: "Klaus Connect — CRM",
    alt: "Klaus Connect CRM dashboard",
  },
  "lead-pipeline": {
    src: "/products/klaus-connect-2.png",
    url: "Klaus Connect — Pipeline",
    alt: "Klaus Connect lead pipeline view",
  },
  "quickbooks-payment": {
    src: "/products/qb-payments.png",
    url: "QB Online Payments",
    alt: "QuickBooks online payment links",
  },
};

const visualMap: Record<string, ComponentType> = {
  "upload-file": FileUploadVisual,
  "customer-e-signing": EsignVisual,
  "inventory-management": InventoryVisual,
  "vehicle-tracking": TrackingVisual,
  "voice-ai-agent": VoiceAiVisual,
  "report-generator": ReportGeneratorVisual,
  "detailed-reporting": DetailedReportingVisual,
};

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
            <ProductRow key={project.id} project={project} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

type ProductRowProps = {
  project: PortfolioProject;
  reverse: boolean;
};

function ProductRow({ project, reverse }: ProductRowProps) {
  const image = imageMap[project.id];
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
        <div
          className={cn(
            "absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br opacity-10 blur-2xl",
            project.accent,
          )}
        />
        {image ? (
          <BrowserFrame src={image.src} alt={image.alt} url={image.url} />
        ) : (
          <Visual />
        )}
      </Reveal>
    </div>
  );
}
