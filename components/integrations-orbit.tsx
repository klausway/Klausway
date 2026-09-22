"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { IntegrationLogo } from "./integration-logo";
import { allIntegrations, allIntegrationGroups } from "@/lib/integrations";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

/** Half-dome coordinate space. The hub sits at (CX, CY); chips get positioned as %. */
const VIEW_W = 1000;
const VIEW_H = 560;
const CX = 500;
const CY = 500;

/**
 * Each ring is one part of the stack: business systems closest to the hub,
 * then conversations, then property data, then the accounts you own.
 */
const rings: { radius: number; seats: { name: string; angle: number }[] }[] = [
  {
    radius: 175,
    seats: [
      { name: "QuickBooks Online", angle: 38 },
      { name: "GoHighLevel", angle: 94 },
      { name: "QXO / Beacon", angle: 146 },
    ],
  },
  {
    radius: 285,
    seats: [
      { name: "RingCentral", angle: 24 },
      { name: "Vapi", angle: 66 },
      { name: "Hatch", angle: 114 },
      { name: "sent.dm", angle: 156 },
    ],
  },
  {
    radius: 390,
    seats: [
      { name: "Nearmap", angle: 18 },
      { name: "RoofScope", angle: 50 },
      { name: "Artemis Solar", angle: 86 },
      { name: "Smarty", angle: 124 },
      { name: "Mapbox", angle: 162 },
    ],
  },
  {
    radius: 478,
    seats: [
      { name: "Amazon S3", angle: 34 },
      { name: "OpenAI", angle: 68 },
      { name: "Your email domain", angle: 140 },
    ],
  },
];

const byName = new Map(allIntegrations.map((item) => [item.name, item]));

/** Semicircle from the left end of the radius, over the top, to the right end. */
function arcPath(radius: number) {
  return `M ${CX - radius} ${CY} A ${radius} ${radius} 0 0 1 ${CX + radius} ${CY}`;
}

export function IntegrationsOrbit() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.dataset.orbit = "visible";
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).dataset.orbit = "visible";
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let chipIndex = 0;

  return (
    <div
      ref={ref}
      data-orbit="hidden"
      className="relative mx-auto mt-14 w-full max-w-6xl"
    >
      {/* The dome needs room to breathe — small screens get a compact grid instead. */}
      <ul className="grid grid-cols-2 gap-2.5 md:hidden">
        {allIntegrations.map((integration, i) => (
          <li
            key={integration.name}
            className="animate-fade-up-stagger flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5"
            style={{ animationDelay: `${i * 45}ms` }}
          >
            <IntegrationLogo integration={integration} />
            <span className="text-sm font-medium leading-tight tracking-tight">
              {integration.name}
            </span>
          </li>
        ))}
      </ul>

      <div
        className="relative hidden md:block"
        style={{ paddingBottom: `${(VIEW_H / VIEW_W) * 100}%` }}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
        >
          <defs>
            <radialGradient id="orbit-core" cx="50%" cy="89%" r="70%">
              <stop offset="0%" stopColor="rgb(79 70 229)" stopOpacity="0.22" />
              <stop offset="45%" stopColor="rgb(79 70 229)" stopOpacity="0.11" />
              <stop offset="100%" stopColor="rgb(79 70 229)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Tinted core fading out through the middle ring */}
          <path
            className="orbit-fill"
            d={`${arcPath(rings[2].radius)} Z`}
            fill="url(#orbit-core)"
          />

          {rings.map((ring, i) => (
            <path
              key={ring.radius}
              className="orbit-arc"
              d={arcPath(ring.radius)}
              pathLength={1}
              fill="none"
              stroke="rgb(79 70 229)"
              strokeOpacity={0.32 - i * 0.05}
              strokeWidth={1.5}
              style={{ animationDelay: `${i * 140}ms` }}
            />
          ))}

          {/* Sync pulse — one wave out from the hub */}
          <path
            className="orbit-pulse"
            d={arcPath(rings[rings.length - 1].radius)}
            fill="none"
            stroke="rgb(79 70 229)"
            strokeWidth={2}
          />
        </svg>

        {rings.map((ring) =>
          ring.seats.map((seat) => {
            const integration = byName.get(seat.name);
            if (!integration) return null;

            const radians = (seat.angle * Math.PI) / 180;
            const left = ((CX + ring.radius * Math.cos(radians)) / VIEW_W) * 100;
            const top = ((CY - ring.radius * Math.sin(radians)) / VIEW_H) * 100;
            const delay = 420 + chipIndex++ * 70;

            return (
              <div
                key={seat.name}
                className="orbit-chip absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${left}%`, top: `${top}%`, animationDelay: `${delay}ms` }}
              >
                <div
                  className="orbit-chip-inner group relative"
                  style={{ animationDelay: `${delay + 700}ms` }}
                >
                  <IntegrationLogo
                    integration={integration}
                    size="md"
                    className="h-12 w-12 rounded-full shadow-card lg:h-14 lg:w-14"
                  />
                  <span className="sr-only">{integration.name}</span>
                  <span className="pointer-events-none absolute -bottom-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-card px-2 py-0.5 text-[11px] font-medium opacity-0 shadow-card transition-opacity group-hover:opacity-100 md:block">
                    {integration.name}
                  </span>
                </div>
              </div>
            );
          }),
        )}

        {/* Hub */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ top: `${(CY / VIEW_H) * 100}%` }}>
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-brand-200 bg-card shadow-card md:h-24 md:w-24">
            <span
              aria-hidden
              className="orbit-hub-ring absolute inset-0 rounded-full border border-brand-400/40 bg-brand-500/10"
            />
            <Image
              src={assetPath("/icon.png")}
              alt="Klaus Way"
              width={96}
              height={96}
              className="relative h-10 w-10 rounded-full object-contain md:h-14 md:w-14"
            />
          </div>
        </div>
      </div>

      <ul className="mx-auto mt-6 flex max-w-2xl flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {allIntegrationGroups.map((group) => (
          <li
            key={group.id}
            className="inline-flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span
              aria-hidden
              className={cn(
                "h-2 w-2 rounded-full bg-gradient-to-br",
                group.accent,
              )}
            />
            {group.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
