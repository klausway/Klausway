import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import { brand } from "@/lib/brand";
import { routes } from "@/lib/navigation";

export function ProcessSection() {
  return (
    <section id="how-we-work" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              {brand.pillars[0].title}. {brand.pillars[1].title}.{" "}
              <span className="text-brand-600">{brand.pillars[2].title}.</span>
            </>
          }
          description={brand.supportingLine}
        />

        <div className="relative mx-auto mt-16 max-w-3xl divide-y divide-border border-y border-border">
          {brand.pillars.map((pillar, i) => (
            <Reveal
              key={pillar.title}
              delay={((i % 3) * 100) as 0 | 100 | 200}
              className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] sm:gap-8"
            >
              <span className="font-mono text-xs font-semibold tracking-widest text-brand-600">
                {pillar.number}
              </span>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                  {pillar.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <TrackedLink
            href={routes.contact}
            event="cta_click"
            eventParams={{ location: "process_section" }}
            className={buttonVariants({ variant: "secondary" })}
          >
            Start with a free consultation
            <ButtonArrow />
          </TrackedLink>
        </Reveal>
      </div>
    </section>
  );
}
