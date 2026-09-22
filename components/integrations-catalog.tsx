"use client";

import { useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { IntegrationLogo } from "./integration-logo";
import {
  allIntegrationGroups,
  type Integration,
  type IntegrationGroup,
} from "@/lib/integrations";
import { cn } from "@/lib/utils";

/** Group titles are written for headings — filter pills need labels that fit one row. */
const pillLabels: Record<string, string> = {
  "accounting-payments": "Accounting",
  "phone-text-voice": "Phone & Voice AI",
  "marketing-lead-capture": "Marketing",
  "property-data": "Property Data",
  "suppliers-ordering": "Suppliers",
  "your-accounts": "Your accounts",
};

type Entry = { integration: Integration; group: IntegrationGroup };

const entries: Entry[] = allIntegrationGroups.flatMap((group) =>
  group.items.map((integration) => ({ integration, group })),
);

/**
 * Filterable catalog — one uniform grid for every integration, so categories
 * with a single tool don't leave a half-empty row.
 */
export function IntegrationsCatalog() {
  const [active, setActive] = useState<string>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? entries
        : entries.filter((entry) => entry.group.id === active),
    [active],
  );
  const activeGroup = allIntegrationGroups.find((group) => group.id === active);

  return (
    // The wrapper is the sticky bar's containing block, so it releases once the
    // catalog ends instead of following the reader down the rest of the page.
    <div>
      <div className="sticky top-[68px] z-30 border-y border-border bg-background/85 backdrop-blur-md">
        <div className="scrollbar-hidden mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-3">
          <FilterPill
            isActive={active === "all"}
            count={entries.length}
            onClick={() => setActive("all")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            All
          </FilterPill>
          {allIntegrationGroups.map((group) => (
            <FilterPill
              key={group.id}
              isActive={active === group.id}
              count={group.items.length}
              onClick={() => setActive(group.id)}
            >
              <group.icon className="h-3.5 w-3.5" />
              {pillLabels[group.id] ?? group.title}
            </FilterPill>
          ))}
        </div>
      </div>

      <section id="catalog" className="relative scroll-mt-36 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Keyed so the heading and the cards replay their entrance per filter. */}
          <div key={active}>
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg",
                  activeGroup ? activeGroup.accent : "from-ink to-ink/70",
                )}
              >
                {activeGroup ? (
                  <activeGroup.icon className="h-5 w-5" />
                ) : (
                  <LayoutGrid className="h-5 w-5" />
                )}
              </div>
              <div>
                <h2 className="font-display text-xl font-bold tracking-tight md:text-2xl">
                  {activeGroup ? activeGroup.title : "Every connection we ship"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {activeGroup
                    ? activeGroup.tagline
                    : "Filter by what your team already runs — each one is switched on per company."}
                </p>
              </div>
            </div>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map(({ integration, group }, i) => (
                <li
                  key={integration.name}
                  className={cn(
                    "group animate-fade-up-stagger relative flex flex-col overflow-hidden rounded-2xl",
                    "border border-border bg-card p-6 transition-all duration-300",
                    "hover:-translate-y-1 hover:border-border-strong hover:shadow-card",
                  )}
                  style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
                >
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                      group.accent,
                    )}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-25",
                      group.accent,
                    )}
                  />

                  <div className="relative flex items-start justify-between gap-3">
                    <IntegrationLogo
                      integration={integration}
                      size="lg"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className="flex items-center gap-1.5 pt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full bg-gradient-to-br",
                          group.accent,
                        )}
                      />
                      {pillLabels[group.id] ?? group.title}
                    </span>
                  </div>

                  <h3 className="relative mt-5 text-base font-semibold tracking-tight">
                    {integration.name}
                  </h3>
                  <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">
                    {integration.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterPill({
  isActive,
  count,
  onClick,
  children,
}: {
  isActive: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={cn(
        "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        isActive
          ? "border-transparent bg-foreground text-background"
          : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
      )}
    >
      {children}
      <span
        className={cn(
          "font-mono text-[10px]",
          isActive ? "text-background/60" : "text-muted-foreground/70",
        )}
      >
        {count}
      </span>
    </button>
  );
}
