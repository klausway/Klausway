import Link from "next/link";
import type { ComponentType } from "react";
import { PipelineVisual } from "./feature-visuals/pipeline-visual";
import { AiCopilotVisual } from "./feature-visuals/ai-copilot-visual";
import { AutomationVisual } from "./feature-visuals/automation-visual";
import { AnalyticsVisual } from "./feature-visuals/analytics-visual";
import { InboxVisual } from "./feature-visuals/inbox-visual";
import { MobileVisual } from "./feature-visuals/mobile-visual";
import { Reveal } from "./animation/reveal";
import { pillars as pillarsBase, type Product } from "@/lib/products";

const visualMap: Record<string, ComponentType> = {
  "klaus-connect": PipelineVisual,
  "klaus-admin": AnalyticsVisual,
  "customer-portal": InboxVisual,
  "crm-intelligence": AiCopilotVisual,
  "n8n-console": AutomationVisual,
  filemaker: AutomationVisual,
  mailagent: InboxVisual,
  spendledger: AnalyticsVisual,
  "field-apps": MobileVisual,
};

type AppWithVisual = Product & { Visual: ComponentType };

const pillars = pillarsBase.map((pillar) => ({
  ...pillar,
  apps: pillar.apps.map((app) => ({
    ...app,
    pillarId: pillar.id,
    pillarLabel: pillar.label,
    Visual: visualMap[app.id],
  })) as AppWithVisual[],
}));

export function Features() {
  return (
    <section id="features" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Our Services
          </div>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Comprehensive IT solutions
            <br />
            <span className="text-gradient-animated">built for your business</span>
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            From custom apps and CRM to automation, analytics, and cloud —
            each solution is built and delivered separately for how you work.
          </p>
        </Reveal>

        <div className="mt-20 space-y-32">
          {pillars.map((pillar, pillarIdx) => (
            <div key={pillar.id} id={pillar.id} className="scroll-mt-28">
              <Reveal className="mb-16 max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">
                  {pillar.label}
                </div>
                <h3 className="mt-2 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
                  {pillar.title}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </Reveal>

              <div className="space-y-32">
                {pillar.apps.map((app, appIdx) => (
                  <FeatureRow
                    key={app.id}
                    app={app}
                    reverse={(pillarIdx + appIdx) % 2 === 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  app,
  reverse,
}: {
  app: AppWithVisual;
  reverse: boolean;
}) {
  const { Visual } = app;
  return (
    <div
      id={app.id}
      className={`scroll-mt-28 grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        reverse ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      <Reveal as="div" delay={100}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            {app.eyebrow}
          </span>
          {app.badge === "New" ? (
            <span className="rounded-full bg-lime-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lime-600">
              New
            </span>
          ) : (
            <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600">
              {app.badge}
            </span>
          )}
        </div>
        <h4 className="mt-3 text-balance text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
          {app.title}
        </h4>
        <p className="mt-2 text-base text-muted-foreground/80">{app.subtitle}</p>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {app.description}
        </p>

        <ul className="mt-6 space-y-2.5">
          {app.bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-2.5 text-sm text-foreground/90"
            >
              <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-600">
                <svg
                  viewBox="0 0 24 24"
                  className="h-2.5 w-2.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
              {b}
            </li>
          ))}
        </ul>

        <Link
          href={`#${app.id}`}
          className="group/learn mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-600"
        >
          <span className="relative inline-flex items-center">
            Open solution
            <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-brand-300 transition-all duration-300 group-hover/learn:w-full" />
          </span>
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover/learn:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </Reveal>

      <Reveal as="div" delay={200} className="relative">
        <Visual />
      </Reveal>
    </div>
  );
}
