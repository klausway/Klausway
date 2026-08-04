"use client";

import { useState } from "react";
import { assetPath } from "@/lib/asset-path";
import { cn } from "@/lib/utils";
import type { TeamMember } from "@/lib/about";

type TeamMemberPhotoProps = {
  member: Pick<TeamMember, "name" | "initials" | "accent" | "image">;
  className?: string;
};

function resolveImageSrc(image?: string | null): string | null {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return assetPath(image);
}

/** Portrait photo with initials fallback when the image is missing or fails to load. */
export function TeamMemberPhoto({ member, className }: TeamMemberPhotoProps) {
  const src = resolveImageSrc(member.image);
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative aspect-[4/5] w-full overflow-hidden rounded-2xl",
        className,
      )}
    >
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br text-4xl font-semibold text-white",
            member.accent,
          )}
          aria-hidden
        >
          {member.initials}
        </div>
      )}
    </div>
  );
}
