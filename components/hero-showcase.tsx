"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProducts } from "@/lib/featured-products";
import { assetPath } from "@/lib/asset-path";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Cinematic product stage — one dominant Klaus Connect shot on an ink panel,
 * with a real-screenshot filmstrip underneath. All cards open the in-site
 * product page (same as Dispatcher), not the external product sites.
 */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <Link
        href={`${routes.products}/klaus-connect`}
        className="group relative block overflow-hidden rounded-[1.75rem] bg-ink shadow-2xl shadow-black/20 ring-1 ring-white/10"
        aria-label="Explore Klaus Connect"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.22),_transparent_55%)]"
        />
        <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={assetPath("/products/klaus-connect-hero.png")}
            alt="Klaus Connect — company scoreboard with live pipeline and revenue"
            className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            loading="eager"
          />
        </div>
        <span className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink-foreground/15 text-ink-foreground opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 sm:bottom-5 sm:right-5">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="relative z-10 -mt-8 px-3 sm:-mt-10 sm:px-6">
        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featuredProducts.map((product, i) => (
            <Link
              key={product.id}
              href={`${routes.products}/${product.id}`}
              className={cn(
                "hover-lift group/card relative w-[9.5rem] shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-lg shadow-black/5 transition-colors hover:border-border-strong sm:w-[11rem]",
              )}
              style={{ animationDelay: `${800 + i * 50}ms` }}
            >
              <div className="aspect-[4/3] overflow-hidden bg-surface-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={assetPath(product.image)}
                  alt=""
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover/card:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex items-center justify-between gap-2 px-3 py-2.5">
                <span className="truncate text-xs font-medium text-foreground">
                  {product.name}
                </span>
                <span
                  className={cn(
                    "h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br",
                    product.accent,
                  )}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
