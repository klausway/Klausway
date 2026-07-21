"use client";

import { useMemo, useState } from "react";
import { Reveal } from "./animation/reveal";
import { cn } from "@/lib/utils";

type ContentDetailMediaProps = {
  title: string;
  coverImage?: string | null;
  galleryImages?: string[];
};

export function ContentDetailMedia({
  title,
  coverImage,
  galleryImages = [],
}: ContentDetailMediaProps) {
  const images = useMemo(() => {
    const combined = [coverImage, ...galleryImages].filter(Boolean) as string[];
    return [...new Set(combined)];
  }, [coverImage, galleryImages]);

  const [activeImage, setActiveImage] = useState<string | null>(null);
  const displayed = activeImage ?? images[0] ?? null;

  if (!displayed) return null;

  const showGallery = images.length > 1;

  return (
    <Reveal delay={100} className="mt-10 space-y-5">
      <figure className="group relative overflow-hidden rounded-3xl border border-black/10 bg-card/20 shadow-xl shadow-black/8">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={displayed}
          alt={`${title} featured`}
          className="aspect-[16/9] w-full object-cover transition-transform duration-500 group-hover:scale-[1.02] md:aspect-[2/1]"
        />
      </figure>

      {showGallery ? (
        <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Gallery
            </h2>
            <span className="text-xs text-muted-foreground">
              {images.length} images — click to preview
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {images.map((image, index) => {
              const isActive = image === displayed;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  aria-label={`Show gallery image ${index + 1}`}
                  aria-pressed={isActive}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-xl border transition-all",
                    isActive
                      ? "border-brand-400/70 ring-2 ring-brand-400/30"
                      : "border-black/10 hover:border-black/20",
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={`${title} gallery ${index + 1}`}
                    className="h-20 w-32 object-cover sm:h-24 sm:w-36"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </Reveal>
  );
}
