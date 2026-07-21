import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { routes } from "@/lib/navigation";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600/20 via-fuchsia-600/15 to-rose-600/10" />
        <div className="dot-pattern absolute inset-0 opacity-20" />
      </div>
      <div className="mx-auto max-w-4xl px-6">
        <Reveal
          as="div"
          className="relative overflow-hidden rounded-3xl border border-black/10 bg-card/60 p-10 text-center backdrop-blur-xl md:p-16"
        >
          <div className="absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-brand-500/30 blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-20 right-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob-2" />
          <h2 className="relative text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Ready to Transform Your
            <br />
            <span className="text-gradient-animated">IT Infrastructure?</span>
          </h2>
          <p className="relative mx-auto mt-5 max-w-lg text-balance text-base text-muted-foreground">
            Let&apos;s discuss how we can help your business thrive with
            cutting-edge technology and custom-built solutions.
          </p>

          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={routes.contact}
              className="group inline-flex items-center gap-2 rounded-xl bg-foreground px-6 py-3.5 text-sm font-semibold text-background transition-all hover:scale-[1.03] hover:shadow-2xl hover:shadow-brand-500/20 active:scale-100"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={routes.apps}
              className="inline-flex items-center gap-2 rounded-xl border border-black/10 bg-black/[0.03] px-6 py-3.5 text-sm font-semibold backdrop-blur transition-all hover:scale-[1.02] hover:border-black/15 hover:bg-black/[0.06]"
            >
              Explore Services
            </Link>
          </div>

          <div className="relative mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-lime-600" />
              Fast delivery
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-lime-600" />
              24/7 support
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-lime-600" />
              Secure solutions
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
