import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { SectionHeading } from "./ui/section-heading";
import {
  solutionOutcomes,
  solutionOutcomesFooter,
} from "@/lib/solutions";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SolutionsHelpSectionProps = {
  /** Show “View all solutions” when used on home. */
  showViewAll?: boolean;
  className?: string;
};

export function SolutionsHelpSection({
  showViewAll = false,
  className,
}: SolutionsHelpSectionProps) {
  return (
    <section
      id="how-we-help"
      className={cn("relative border-y border-border bg-card py-24", className)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          align="left"
          eyebrow="Solutions"
          title={
            <>
              How Klaus Way{" "}
              <span className="text-brand-600">helps</span>
            </>
          }
          description="Practical ways we simplify the work — so your team spends less time fighting tools and more time running the business."
          aside={
            showViewAll ? (
              <Link
                href={routes.solutions}
                className="group inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                View all solutions
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            ) : undefined
          }
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {solutionOutcomes.map((outcome, i) => (
            <Reveal
              key={outcome.id}
              delay={((i % 3) * 100) as 0 | 100 | 200}
              className="hover-lift flex h-full flex-col rounded-2xl border border-border bg-background p-6 transition-colors hover:border-border-strong"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-brand-600">
                <outcome.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">
                {outcome.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {outcome.description}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            {solutionOutcomesFooter}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
