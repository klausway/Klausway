import { cn } from "@/lib/utils";

type ContentCardCoverProps = {
  src?: string | null;
  alt: string;
  accent?: string;
};

export function ContentCardCover({ src, alt, accent }: ContentCardCoverProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }

  return (
    <div
      className={cn(
        "aspect-[16/10] w-full bg-gradient-to-br",
        accent ?? "from-brand-500/25 via-card/60 to-fuchsia-500/15",
      )}
      aria-hidden
    />
  );
}
