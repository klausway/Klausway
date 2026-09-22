import { Plug } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { Eyebrow } from "./ui/eyebrow";
import { IntegrationLogo } from "./integration-logo";
import { IntegrationsCatalog } from "./integrations-catalog";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import { integrationsFooter, ownedAccountsGroup } from "@/lib/integrations";
import { routes } from "@/lib/navigation";

/** /integrations body — the filterable catalog, then the ownership close. */
export function IntegrationsDirectory() {
  return (
    <>
      <IntegrationsCatalog />

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <OwnedAccountsBand />

          <Reveal className="group relative mt-10 overflow-hidden rounded-3xl border border-border bg-card p-8 md:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl transition-opacity duration-700 group-hover:opacity-70"
            />
            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-brand-600 transition-transform duration-300 group-hover:-rotate-12">
                  <Plug className="h-5 w-5" />
                </div>
                <div className="max-w-xl">
                  <h2 className="font-display text-xl font-bold tracking-tight">
                    {integrationsFooter.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {integrationsFooter.description}
                  </p>
                </div>
              </div>
              <TrackedLink
                href={routes.contact}
                event="cta_click"
                eventParams={{
                  location: "integrations_page",
                  label: integrationsFooter.ctaLabel,
                }}
                className={buttonVariants({ className: "shrink-0" })}
              >
                {integrationsFooter.ctaLabel}
                <ButtonArrow />
              </TrackedLink>
            </div>
          </Reveal>

          <Reveal className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
            {integrationsFooter.microcopy}
          </Reveal>
        </div>
      </section>
    </>
  );
}

/**
 * The ownership argument gets the ink band — it's the trust close of the page.
 * Each service is described on its catalog card, so this only names them.
 */
function OwnedAccountsBand() {
  const group = ownedAccountsGroup;

  return (
    <Reveal className="relative overflow-hidden rounded-3xl bg-ink p-8 text-ink-foreground md:p-12">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid-pattern absolute inset-0 bg-[size:32px_32px] opacity-60" />
        <div className="animate-blob-1 absolute -top-28 -right-16 h-64 w-64 rounded-full bg-signal/10 blur-3xl" />
        <div className="animate-blob-2 absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal text-ink">
            <group.icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-5 flex justify-center">
          <Eyebrow onDark>Data ownership</Eyebrow>
        </div>
        <h2 className="mt-5 text-balance font-display text-2xl font-bold leading-tight tracking-tight md:text-4xl">
          {group.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-sm leading-relaxed text-ink-foreground/70">
          {group.tagline}
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {group.items.map((integration) => (
            <li
              key={integration.name}
              className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-colors hover:border-white/25 hover:bg-white/10"
            >
              <IntegrationLogo integration={integration} onDark />
              <span className="text-sm font-medium tracking-tight">
                {integration.name}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
