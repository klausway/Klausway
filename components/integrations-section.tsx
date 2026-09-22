import Link from "next/link";
import { ArrowRight, Plug } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { IntegrationsOrbit } from "./integrations-orbit";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import {
  allIntegrations,
  integrationsFooter,
  integrationsHeader,
} from "@/lib/integrations";
import { routes } from "@/lib/navigation";

export function IntegrationsSection() {
  return (
    <section id="integrations" className="relative overflow-hidden py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
      />
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow={integrationsHeader.eyebrow}
          title={
            <>
              Works with the tools{" "}
              <span className="text-brand-600">you already pay for</span>
            </>
          }
          description={integrationsHeader.description}
        />

        <IntegrationsOrbit />

        <Reveal className="mt-14 overflow-hidden rounded-3xl border border-dashed border-border-strong bg-card p-8 md:p-10">
          <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand-600">
                <Plug className="h-5 w-5" />
              </div>
              <div className="max-w-xl">
                <h3 className="text-lg font-semibold tracking-tight">
                  {integrationsFooter.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {integrationsFooter.description}
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-start gap-3 sm:flex-row sm:items-center">
              <TrackedLink
                href={routes.contact}
                event="cta_click"
                eventParams={{
                  location: "integrations_section",
                  label: integrationsFooter.ctaLabel,
                }}
                className={buttonVariants()}
              >
                {integrationsFooter.ctaLabel}
                <ButtonArrow />
              </TrackedLink>
              <Link
                href={routes.integrations}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                All {allIntegrations.length} integrations
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          {integrationsFooter.microcopy}
        </Reveal>
      </div>
    </section>
  );
}
