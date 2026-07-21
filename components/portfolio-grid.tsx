"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { ContentCardCover } from "./content-card-cover";
import {
  portfolioCategories,
  type PortfolioCategory,
  type PortfolioProject,
} from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type PortfolioGridProps = {
  projects: PortfolioProject[];
  hideHeader?: boolean;
};

export function PortfolioGrid({ projects, hideHeader = false }: PortfolioGridProps) {
  const [active, setActive] = useState<PortfolioCategory | "All">("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.categories.includes(active));

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-xs text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Portfolio
            </div>
            <h2 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Successful projects across{" "}
              <span className="text-gradient-animated">every industry</span>
            </h2>
          </Reveal>
        )}

        <Reveal as="div" delay={100} className="mt-10 flex flex-wrap justify-center gap-2">
          <FilterPill
            label="All"
            active={active === "All"}
            onClick={() => setActive("All")}
          />
          {portfolioCategories.map((cat) => (
            <FilterPill
              key={cat}
              label={cat}
              active={active === cat}
              onClick={() => setActive(cat)}
            />
          ))}
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => (
            <Reveal
              key={project.id}
              id={project.id}
              delay={((i % 3) * 100) as 0 | 100 | 200 | 300 | 400}
              className="scroll-mt-28 hover-lift group flex flex-col overflow-hidden rounded-2xl border border-black/[0.08] bg-card/40 backdrop-blur transition-all hover:border-black/10 hover:bg-card/60 hover:shadow-xl hover:shadow-black/8"
            >
              <ContentCardCover
                src={project.coverImage}
                alt={project.title}
                accent={project.accent}
              />
              {!project.coverImage ? (
                <div
                  className={cn(
                    "h-1 w-full bg-gradient-to-r",
                    project.accent,
                  )}
                />
              ) : null}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold tracking-tight">
                  {project.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-black/[0.03] px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={`${routes.portfolio}/${project.id}`}
                  className="group/link mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-600"
                >
                  View Project
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-brand-400/40 bg-brand-500/15 text-brand-700"
          : "border-black/10 bg-black/[0.03] text-muted-foreground hover:border-black/15 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
