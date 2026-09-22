import type { Integration } from "@/lib/integrations";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

type IntegrationLogoProps = {
  integration: Integration;
  /** sm = list rows, md = feature cards and the logo wall, lg = catalog cards. */
  size?: "sm" | "md" | "lg";
  onDark?: boolean;
  className?: string;
};

const tileSizes = {
  sm: "h-9 w-9 rounded-lg",
  md: "h-12 w-12 rounded-xl",
  lg: "h-14 w-14 rounded-2xl text-sm",
} as const;

const logoSizes = {
  sm: "h-5 w-5",
  md: "h-7 w-7",
  lg: "h-8 w-8",
} as const;

/**
 * Brand logo in a neutral tile — always white behind the mark so brand colors
 * read the same on the paper background and on the ink band. Falls back to the
 * monogram (or a Lucide icon) for entries that have no third-party logo.
 */
export function IntegrationLogo({
  integration,
  size = "sm",
  onDark = false,
  className,
}: IntegrationLogoProps) {
  const Icon = integration.icon;
  const fill = Boolean(integration.logo && integration.logoFill);

  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden border",
        tileSizes[size],
        fill
          ? "border-black/10"
          : integration.logo || Icon
            ? "border-black/5 bg-white shadow-sm"
            : onDark
              ? "border-white/10 bg-white/10 font-mono text-[11px] font-semibold text-ink-foreground/80"
              : "border-border bg-surface-2 font-mono text-[11px] font-semibold text-foreground/70",
        className,
      )}
    >
      {integration.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={assetPath(integration.logo)}
          alt={`${integration.name} logo`}
          loading="lazy"
          className={cn(
            "object-contain",
            fill ? "h-full w-full" : logoSizes[size],
          )}
        />
      ) : Icon ? (
        <Icon className={cn("text-ink", logoSizes[size])} />
      ) : (
        integration.mark
      )}
    </span>
  );
}
