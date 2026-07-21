import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { routes } from "@/lib/navigation";
import { allProducts } from "@/lib/products";

function Badge({ label }: { label: string }) {
  if (label === "New") {
    return (
      <span className="rounded-full bg-lime-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-lime-600">
        {label}
      </span>
    );
  }
  return (
    <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-600">
      {label}
    </span>
  );
}

export function ProductsShowcase() {
  return (
    <section id="products" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-lime-400" />
            All 9 portal apps
          </div>
          <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Explore the{" "}
            <span className="text-gradient-animated">Klaus Way ecosystem</span>
          </h2>
          <p className="mt-5 text-balance text-lg text-muted-foreground">
            Click any app to view full details — CRM, AI voice, automation,
            developer tools, and finance, all in one portal.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allProducts.map((product, i) => (
            <Reveal
              key={product.id}
              delay={(i % 4) * 100 as 0 | 100 | 200 | 300}
            >
              <Link
                href={`${routes.apps}#${product.id}`}
                className="hover-lift group flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card/40 transition-all hover:border-black/10 hover:bg-card/60 hover:shadow-xl hover:shadow-black/8"
              >
                <div
                  className={`h-1 bg-gradient-to-r ${product.color} opacity-80 transition-opacity group-hover:opacity-100`}
                />
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${product.color} text-[11px] font-bold text-white shadow-lg transition-transform group-hover:scale-105`}
                    >
                      {product.icon}
                    </div>
                    <Badge label={product.badge} />
                  </div>

                  <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {product.pillarLabel}
                  </div>
                  <h3 className="mt-1 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-600">
                    {product.eyebrow}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground/90">
                    {product.subtitle}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors group-hover:text-brand-600">
                    View product
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <Link
            href={routes.apps}
            className="group inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-6 py-3 text-sm font-semibold backdrop-blur transition-all hover:border-black/15 hover:bg-black/[0.06]"
          >
            Browse full app catalog
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
