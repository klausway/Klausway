"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import { Reveal } from "./animation/reveal";
import type { ProductTourStep } from "@/lib/featured-products";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

type ProductTourProps = {
  productName: string;
  steps: ProductTourStep[];
  accent: string;
};

/**
 * Guided screenshot walkthrough: numbered steps, keyboard navigation, and a
 * lightbox for viewing any screen full size.
 */
export function ProductTour({ productName, steps, accent }: ProductTourProps) {
  const [index, setIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const total = steps.length;

  const go = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") go(index + 1);
      if (event.key === "ArrowLeft") go(index - 1);
      if (event.key === "Escape") setZoomed(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index]);

  if (!total) return null;
  const step = steps[index];

  return (
    <Reveal delay={100} className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Product tour
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Step through {total} real screens from {productName}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous screen"
            className="rounded-full border border-black/10 bg-black/[0.03] p-2 transition-colors hover:border-black/20 hover:bg-black/[0.06]"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="tabular-nums text-sm text-muted-foreground">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next screen"
            className="rounded-full border border-black/10 bg-black/[0.03] p-2 transition-colors hover:border-black/20 hover:bg-black/[0.06]"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <figure className="relative">
        <div
          className={cn(
            "absolute -inset-3 -z-10 rounded-3xl bg-gradient-to-br opacity-20 blur-2xl",
            accent,
          )}
        />
        <button
          type="button"
          onClick={() => setZoomed(true)}
          aria-label={`View ${step.title} full size`}
          className="group block w-full overflow-hidden rounded-2xl border border-black/10 bg-card/40 shadow-xl"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(step.image)}
            alt={`${productName} — ${step.title}`}
            className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
          />
          <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
            <Expand className="h-3.5 w-3.5" />
            View full size
          </span>
        </button>
        <figcaption className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <p className="text-sm font-semibold">{step.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {step.caption}
          </p>
        </figcaption>
      </figure>

      {total > 1 ? (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {steps.map((item, i) => (
            <button
              key={item.image}
              type="button"
              onClick={() => go(i)}
              aria-label={`Go to step ${i + 1}: ${item.title}`}
              aria-current={i === index}
              className={cn(
                "relative shrink-0 overflow-hidden rounded-xl border transition-all",
                i === index
                  ? "border-brand-400/70 ring-2 ring-brand-400/30"
                  : "border-black/10 opacity-70 hover:opacity-100",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assetPath(item.image)}
                alt=""
                className="h-20 w-32 object-cover object-top sm:h-24 sm:w-40"
              />
              <span className="absolute left-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-[10px] font-semibold text-white">
                {i + 1}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {zoomed ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${productName} — ${step.title}`}
          onClick={() => setZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
        >
          <button
            type="button"
            onClick={() => setZoomed(false)}
            aria-label="Close full size view"
            className="absolute right-5 top-5 rounded-full bg-white/10 p-2.5 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath(step.image)}
            alt={`${productName} — ${step.title}`}
            onClick={(event) => event.stopPropagation()}
            className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      ) : null}
    </Reveal>
  );
}
