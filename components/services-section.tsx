import { CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import {
  serviceCategories,
  servicesPageHeader,
  whyChooseUs,
} from "@/lib/services";
import { cn } from "@/lib/utils";

type ServicesSectionProps = {
  showHeader?: boolean;
};

export function ServicesSection({ showHeader = true }: ServicesSectionProps) {
  return (
    <>
      <section id="services" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6">
          {showHeader ? (
            <Reveal className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
                {servicesPageHeader.title}
              </div>
              <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                {servicesPageHeader.title}
              </h2>
              <p className="mt-5 text-balance text-lg text-muted-foreground">
                {servicesPageHeader.subtitle}
              </p>
            </Reveal>
          ) : null}

          <div
            className={cn(
              "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
              showHeader ? "mt-16" : "mt-0",
            )}
          >
            {serviceCategories.map((service, i) => (
              <Reveal
                key={service.id}
                id={service.id}
                delay={((i % 3) * 100) as 0 | 100 | 200 | 300 | 400}
                className="scroll-mt-28 hover-lift group flex flex-col rounded-2xl border border-black/[0.08] bg-card/40 p-6 backdrop-blur transition-all hover:border-black/10 hover:bg-card/60 hover:shadow-xl hover:shadow-black/8"
              >
                <div
                  className={cn(
                    "mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg",
                    service.accent,
                  )}
                >
                  <service.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {service.tagline}
                </p>
                <ul className="mt-4 flex-1 space-y-2 border-t border-black/[0.08] pt-4">
                  {service.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex items-start gap-2 text-sm text-foreground/85"
                    >
                      <CircleCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-600" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="why-choose-us" className="relative border-t border-black/[0.08] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Why Choose{" "}
              <span className="text-gradient-animated">Us?</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <Reveal
                key={item.title}
                delay={((i % 3) * 100) as 0 | 100 | 200 | 300 | 400}
                className="hover-lift rounded-2xl border border-black/[0.08] bg-card/40 p-6 text-center backdrop-blur transition-all hover:border-black/10 hover:bg-card/60"
              >
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
