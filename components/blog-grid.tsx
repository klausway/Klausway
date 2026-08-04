"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { ContentCardCover } from "./content-card-cover";
import {
  resourceTypeLabels,
  resourceTypes,
  type ResourcePost,
  type ResourceType,
} from "@/lib/blog";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type ResourcesGridProps = {
  posts: ResourcePost[];
  hideHeader?: boolean;
  initialType?: ResourceType | "all";
};

export function ResourcesGrid({
  posts,
  hideHeader = false,
  initialType = "all",
}: ResourcesGridProps) {
  const [activeType, setActiveType] = useState<ResourceType | "all">(initialType);

  const filtered = useMemo(() => {
    if (activeType === "all") return posts;
    return posts.filter((post) => post.type === activeType);
  }, [posts, activeType]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: posts.length };
    for (const type of resourceTypes) {
      map[type] = posts.filter((post) => post.type === type).length;
    }
    return map;
  }, [posts]);

  return (
    <section className="relative pb-24">
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Resources
            </h2>
          </Reveal>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          <FilterChip
            active={activeType === "all"}
            label={`All (${counts.all})`}
            onClick={() => setActiveType("all")}
          />
          {resourceTypes.map((type) => (
            <FilterChip
              key={type}
              active={activeType === type}
              label={`${resourceTypeLabels[type]} (${counts[type] ?? 0})`}
              onClick={() => setActiveType(type)}
            />
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-center text-sm text-muted-foreground">
            No resources in this category yet. Check back soon.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((post, i) => (
              <Reveal
                key={post.slug}
                delay={((i % 3) * 100) as 0 | 100 | 200}
                className="hover-lift group flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card/40 backdrop-blur transition-all hover:border-black/10 hover:bg-card/60"
              >
                <ContentCardCover
                  src={post.coverImage}
                  alt={post.title}
                  accent="from-brand-500/25 via-card/60 to-violet-500/15"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-brand-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brand-700">
                      {resourceTypeLabels[post.type]}
                    </span>
                    <time
                      dateTime={post.date}
                      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand-600">
                    {post.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`${routes.resources}/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors hover:text-brand-600"
                  >
                    {post.type === "guide" ? "Read guide" : "Read more"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** @deprecated Use ResourcesGrid */
export const BlogGrid = ResourcesGrid;

function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
        active
          ? "bg-foreground text-background"
          : "bg-black/[0.04] text-muted-foreground hover:bg-black/[0.07] hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
