import { PhoneCall, PencilRuler, LifeBuoy } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import { TrackedLink } from "./tracked-link";
import { ButtonArrow, buttonVariants } from "./ui/button";
import { routes } from "@/lib/navigation";

const steps = [
  {
    icon: PhoneCall,
    title: "Tell us how you run",
    description:
      "A free 30-minute call. You walk us through how the work actually flows — leads, jobs, crews, invoices — and where it breaks down.",
  },
  {
    icon: PencilRuler,
    title: "We design and build around it",
    description:
      "We map your process into software: screens your team recognizes, automations that remove the busywork, nothing you don't need.",
  },
  {
    icon: LifeBuoy,
    title: "We run it with you",
    description:
      "Hosting, updates, and support come from the same people who built it. When something changes in your business, the software changes too.",
  },
];

export function ProcessSection() {
  return (
    <section id="how-we-work" className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How we work"
          title={
            <>
              From first call to{" "}
              <span className="text-brand-600">running system</span>
            </>
          }
          description="No discovery phases that drag on for months. We keep the loop short: understand the business, ship the system, stay accountable for it."
        />

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div
            aria-hidden
            className="absolute top-12 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-border-strong to-transparent md:block"
          />
          {steps.map((step, i) => (
            <Reveal
              key={step.title}
              delay={((i % 3) * 100) as 0 | 100 | 200}
              className="hover-lift relative flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:border-border-strong hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-ink text-ink-foreground">
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="font-mono text-xs font-semibold tracking-widest text-brand-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
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
            Start with the free call
            <ButtonArrow />
          </TrackedLink>
        </Reveal>
      </div>
    </section>
  );
}
