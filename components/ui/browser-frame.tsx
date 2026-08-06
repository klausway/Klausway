import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

type BrowserFrameProps = {
  src: string;
  alt: string;
  url?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
};

/**
 * Monochrome browser chrome around a real product screenshot — the standard
 * presentation for every screenshot on the site.
 */
export function BrowserFrame({
  src,
  alt,
  url,
  className,
  imgClassName,
  priority = false,
}: BrowserFrameProps) {
  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
        className,
      )}
    >
      <div className="relative flex h-8 items-center border-b border-border bg-surface-2 px-3">
        <span aria-hidden className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-border-strong" />
          <span className="h-2 w-2 rounded-full bg-border-strong" />
          <span className="h-2 w-2 rounded-full bg-border-strong" />
        </span>
        {url ? (
          <span className="absolute left-1/2 -translate-x-1/2 rounded-md bg-card px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            {url}
          </span>
        ) : null}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assetPath(src)}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={cn("block w-full", imgClassName)}
      />
    </figure>
  );
}
