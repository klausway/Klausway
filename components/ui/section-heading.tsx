import type { ReactNode } from "react";
import { Reveal } from "@/components/animation/reveal";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left";
  onDark?: boolean;
  /** Rendered on the right of the heading row when align="left" (e.g. a ghost link). */
  aside?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  onDark = false,
  aside,
  className,
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <Reveal
      as="div"
      className={cn(
        centered ? "mx-auto max-w-2xl text-center" : "max-w-3xl text-left",
        className,
      )}
    >
      {eyebrow ? <Eyebrow onDark={onDark}>{eyebrow}</Eyebrow> : null}
      <div
        className={cn(
          !centered && aside
            ? "flex flex-wrap items-end justify-between gap-4"
            : undefined,
        )}
      >
        <h2
          className={cn(
            "text-balance font-display text-3xl font-bold leading-tight tracking-tight md:text-4xl",
            eyebrow ? "mt-4" : undefined,
            onDark ? "text-ink-foreground" : "text-foreground",
          )}
        >
          {title}
        </h2>
        {!centered && aside ? <div className="shrink-0 pb-1">{aside}</div> : null}
      </div>
      {description ? (
        <p
          className={cn(
            "mt-4 text-balance text-base leading-relaxed md:text-lg",
            centered ? "mx-auto" : undefined,
            onDark ? "text-ink-foreground/70" : "text-muted-foreground",
          )}
        >
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
