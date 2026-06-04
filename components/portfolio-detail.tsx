import { CircleCheck } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { ContentDetailMedia } from "./content-detail-media";
import {
  ContentDetailArticle,
  ContentDetailMeta,
  ContentDetailShell,
} from "./content-detail-shell";
import { RichTextContent } from "./rich-text-content";
import type { PortfolioProject } from "@/lib/portfolio";
import { routes } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type PortfolioDetailProps = {
  project: PortfolioProject;
};

export function PortfolioDetail({ project }: PortfolioDetailProps) {
  return (
    <ContentDetailShell backHref={routes.portfolio} backLabel="Back to Portfolio">
      {!project.coverImage ? (
        <Reveal delay={100} className="mt-10">
          <div
            className={cn(
              "h-1.5 w-full rounded-full bg-gradient-to-r",
              project.accent,
            )}
          />
        </Reveal>
      ) : null}

      <ContentDetailMedia
        title={project.title}
        coverImage={project.coverImage}
        galleryImages={project.galleryImages}
      />

      <ContentDetailMeta
        items={[
          {
            label: "Tags",
            value: (
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ),
          },
          {
            label: "Categories",
            value: project.categories.join(", ") || "—",
          },
        ]}
      />

      <ContentDetailArticle>
        <RichTextContent
          html={project.overview}
          className="prose-lg md:prose-xl prose-p:leading-[1.85]"
        />
      </ContentDetailArticle>

      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        <DetailBlock title="Key Features" items={project.keyFeatures} delay={200} />
        <DetailBlock title="Benefits" items={project.benefits} delay={300} />
        <DetailBlock
          title="Use Cases"
          items={project.useCases}
          delay={400}
          checkmark
        />
      </div>
    </ContentDetailShell>
  );
}

function DetailBlock({
  title,
  items,
  delay,
  checkmark = false,
}: {
  title: string;
  items: string[];
  delay: 0 | 100 | 200 | 300 | 400;
  checkmark?: boolean;
}) {
  return (
    <Reveal
      delay={delay}
      className="h-full rounded-3xl border border-white/10 bg-card/30 p-6 backdrop-blur-sm md:p-8"
    >
      <h2 className="text-lg font-semibold tracking-tight md:text-xl">{title}</h2>
      <ul className="mt-5 space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-sm leading-relaxed text-foreground/90 md:text-base"
          >
            <CircleCheck
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                checkmark ? "text-lime-400" : "text-brand-300",
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
