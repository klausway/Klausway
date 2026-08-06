import type { ReactNode } from "react";
import { AmbientBackground } from "./animation/ambient-background";
import { Reveal } from "./animation/reveal";
import { Eyebrow } from "./ui/eyebrow";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  wide?: boolean;
};

export function PageHeader({ eyebrow, title, description, wide }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden pt-28 pb-12 md:pt-32 md:pb-14">
      <AmbientBackground variant="section" />
      <div
        className={cn(
          "mx-auto px-6 text-center lg:px-10",
          wide ? "max-w-6xl" : "max-w-4xl",
        )}
      >
        <Reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="mt-5 text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
