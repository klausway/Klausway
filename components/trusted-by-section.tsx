import Image from "next/image";
import { Reveal } from "./animation/reveal";
import { clients } from "@/lib/clients";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

export function TrustedBySection() {
  return (
    <section id="trusted-by" className="relative py-20 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border-strong to-transparent"
      />
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="text-center">
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-brand-600">
            Trusted by
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Teams we build for
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {clients.map((client, i) => (
            <Reveal
              key={client.name}
              delay={(i * 100) as 0 | 100}
              className="hover-lift flex min-h-[7.5rem] items-center justify-center rounded-2xl border border-border bg-card px-8 py-10 transition-colors hover:border-border-strong"
            >
              {client.logo ? (
                <Image
                  src={assetPath(client.logo)}
                  alt={client.name}
                  width={220}
                  height={64}
                  className="h-12 w-auto max-w-[220px] object-contain opacity-80"
                />
              ) : (
                <div className="text-center">
                  <p
                    className={cn(
                      "font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl",
                    )}
                  >
                    {client.name}
                  </p>
                  {client.location ? (
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                      {client.location}
                    </p>
                  ) : null}
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
