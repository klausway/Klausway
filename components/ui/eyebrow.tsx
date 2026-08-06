import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  onDark?: boolean;
  className?: string;
};

/** Mono micro-label with a lime signal square — replaces the glassy pill eyebrows. */
export function Eyebrow({ children, onDark = false, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em]",
        onDark ? "text-signal" : "text-brand-600",
        className,
      )}
    >
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 bg-signal" />
      {children}
    </span>
  );
}
