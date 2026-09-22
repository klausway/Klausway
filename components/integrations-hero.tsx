import { AmbientBackground } from "./animation/ambient-background";
import { Reveal } from "./animation/reveal";
import { Eyebrow } from "./ui/eyebrow";
import { IntegrationLogo } from "./integration-logo";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import {
  allIntegrationGroups,
  allIntegrations,
  integrationsFooter,
  integrationsPageHeader,
} from "@/lib/integrations";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const stats = [
  { value: String(allIntegrations.length), label: "live integrations" },
  { value: String(allIntegrationGroups.length), label: "categories" },
  { value: "0", label: "exports or double entry" },
];

/** Split into two marquee rows that travel in opposite directions. */
const half = Math.ceil(allIntegrations.length / 2);
const rows = [allIntegrations.slice(0, half), allIntegrations.slice(half)];

export function IntegrationsHero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-32">
      <AmbientBackground variant="section" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <Eyebrow>{integrationsPageHeader.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Works with the tools{" "}
            <span className="underline-signal">you already pay for</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
            {integrationsPageHeader.description}
          </p>
        </Reveal>

        <Reveal delay={100} className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <TrackedLink
            href={routes.contact}
            event="cta_click"
            eventParams={{
              location: "integrations_hero",
              label: integrationsFooter.ctaLabel,
            }}
            className={buttonVariants()}
          >
            {integrationsFooter.ctaLabel}
            <ButtonArrow />
          </TrackedLink>
          <a href="#catalog" className={buttonVariants({ variant: "secondary" })}>
            Browse the catalog
          </a>
        </Reveal>

        <Reveal
          delay={200}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-display text-3xl font-bold tracking-tight text-brand-600">
                {stat.value}
              </div>
              <div className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      {/* Decorative — every logo below is listed in the catalog with its description. */}
      <Reveal
        delay={300}
        className="marquee mask-fade-x relative mt-14 space-y-3 overflow-hidden"
      >
        <div aria-hidden className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className="marquee-track"
              data-direction={i === 1 ? "reverse" : undefined}
              style={{ animationDuration: `${46 + i * 10}s` }}
            >
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 gap-3 pr-3">
                  {row.map((integration) => (
                    <span
                      key={integration.name}
                      className={cn(
                        "flex items-center gap-2.5 rounded-full border border-border bg-card px-4 py-2.5",
                        "whitespace-nowrap shadow-sm transition-colors hover:border-border-strong",
                      )}
                    >
                      <IntegrationLogo integration={integration} />
                      <span className="text-sm font-medium tracking-tight">
                        {integration.name}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
