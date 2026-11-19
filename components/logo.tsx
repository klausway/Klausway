import Image from "next/image";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";

type LogoProps = {
  /** Logo height in pixels */
  height?: number;
  className?: string;
  showText?: boolean;
  textClassName?: string;
};

export function Logo({
  height = 40,
  className,
  showText = false,
  textClassName,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src={assetPath("/logo-mark.png")}
        alt="Klaus Way Technology logo"
        width={height}
        height={height}
        className="rounded-lg object-contain"
        style={{ width: height, height }}
        priority
      />
      {showText && (
        <span
          className={cn(
            "font-semibold tracking-tight",
            textClassName ?? "text-lg",
          )}
        >
          Klaus Way
        </span>
      )}
    </span>
  );
}
