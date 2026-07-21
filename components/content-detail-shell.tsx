import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/animation/reveal";
import { cn } from "@/lib/utils";

type ContentDetailShellProps = {
  backHref: string;
  backLabel: string;
  children: ReactNode;
  className?: string;
};

export function ContentDetailShell({
  backHref,
  backLabel,
  children,
  className,
}: ContentDetailShellProps) {
  return (
    <section className="relative pb-28">
      <div className={cn("mx-auto w-full max-w-6xl px-6 lg:px-10", className)}>
        <Reveal>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-black/15 hover:bg-black/[0.05] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {backLabel}
          </Link>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function ContentDetailMeta({
  items,
}: {
  items: { label: string; value: ReactNode }[];
}) {
  return (
    <Reveal delay={100} className="mt-8 flex flex-wrap gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3"
        >
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
            {item.label}
          </p>
          <div className="mt-1 text-sm text-foreground/90">{item.value}</div>
        </div>
      ))}
    </Reveal>
  );
}

export function ContentDetailArticle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Reveal delay={200}>
      <article
        className={cn(
          "mt-10 rounded-3xl border border-black/10 bg-card/30 p-8 backdrop-blur-sm md:p-10 lg:p-12",
          className,
        )}
      >
        {children}
      </article>
    </Reveal>
  );
}
