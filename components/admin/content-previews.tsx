"use client";

import { ArrowRight, CircleCheck } from "lucide-react";
import { ContentCardCover } from "@/components/content-card-cover";
import { ContentDetailMedia } from "@/components/content-detail-media";
import { RichTextContent } from "@/components/rich-text-content";
import { cn } from "@/lib/utils";

type BlogPreviewData = {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  coverImage?: string | null;
  galleryImages?: string[];
};

type PortfolioPreviewData = {
  slug?: string;
  title?: string;
  description?: string;
  overview?: string;
  accent?: string;
  tags?: string[];
  coverImage?: string | null;
  galleryImages?: string[];
  keyFeatures?: string[];
  benefits?: string[];
  useCases?: string[];
};

export function PreviewPanel({
  mode,
  onModeChange,
  children,
}: {
  mode: "card" | "detail";
  onModeChange: (mode: "card" | "detail") => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a12] shadow-2xl shadow-black/40">
      <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-lime-400/80" />
        <span className="ml-2 flex-1 truncate rounded-md bg-black/30 px-3 py-1 text-[10px] text-muted-foreground">
          klausway.com preview
        </span>
      </div>

      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-300">
            Live preview
          </p>
          <p className="text-[11px] text-muted-foreground">
            Updates as you edit
          </p>
        </div>
        <div className="flex rounded-lg border border-white/10 bg-black/20 p-0.5">
          {(["card", "detail"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => onModeChange(item)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[11px] font-medium transition-colors",
                mode === item
                  ? "bg-brand-500/25 text-brand-100"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item === "card" ? "Card" : "Detail"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#090912] p-4">{children}</div>
    </div>
  );
}

export function BlogCardPreview({ data }: { data: BlogPreviewData }) {
  const title = data.title || "Blog post title";
  const excerpt = data.excerpt || "Short excerpt shown on the blog listing card.";
  const date = data.date || new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-card/40">
      <ContentCardCover
        src={data.coverImage}
        alt={title}
        accent="from-brand-500/25 via-card/60 to-violet-500/15"
      />
      <div className="p-5">
        <time className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {new Date(date).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <h3 className="mt-2 text-lg font-semibold leading-snug">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-300">
          Read More
          <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export function BlogDetailPreview({ data }: { data: BlogPreviewData }) {
  const title = data.title || "Blog post title";
  const content = data.content || data.excerpt || "Full article content appears here.";
  const date = data.date || new Date().toISOString().slice(0, 10);

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-wider text-brand-300">Blog</p>
      <h1 className="mt-2 text-2xl font-semibold leading-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {new Date(date).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      <ContentDetailMedia
        title={title}
        coverImage={data.coverImage}
        galleryImages={data.galleryImages ?? []}
      />
      <RichTextContent html={content} className="mt-6" />
    </div>
  );
}

export function PortfolioCardPreview({ data }: { data: PortfolioPreviewData }) {
  const title = data.title || "Project title";
  const description = data.description || "Short description on the portfolio grid card.";
  const accent = data.accent || "from-cyan-400 to-blue-500";
  const tags = data.tags?.length ? data.tags : ["Tag"];

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-2xl border border-white/5 bg-card/40">
      <ContentCardCover src={data.coverImage} alt={title} accent={accent} />
      {!data.coverImage ? (
        <div className={cn("h-1 w-full bg-gradient-to-r", accent)} />
      ) : null}
      <div className="p-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-white/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300">
          View Project
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export function PortfolioDetailPreview({ data }: { data: PortfolioPreviewData }) {
  const title = data.title || "Project title";
  const description = data.description || "Subtitle under the page header.";
  const overview = data.overview || "Project overview paragraph on the detail page.";
  const accent = data.accent || "from-cyan-400 to-blue-500";
  const tags = data.tags?.length ? data.tags : ["Tag"];
  const keyFeatures = data.keyFeatures?.length
    ? data.keyFeatures.slice(0, 3)
    : ["Key feature example"];

  return (
    <div className="mx-auto max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-wider text-brand-300">Portfolio</p>
      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>

      {!data.coverImage ? (
        <div className={cn("mt-6 h-1.5 w-full rounded-full bg-gradient-to-r", accent)} />
      ) : null}

      <ContentDetailMedia
        title={title}
        coverImage={data.coverImage}
        galleryImages={data.galleryImages ?? []}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>

      <RichTextContent html={overview} className="mt-4" />

      <div className="mt-6 rounded-2xl border border-white/5 bg-card/40 p-4">
        <h2 className="text-sm font-semibold">Key Features</h2>
        <ul className="mt-3 space-y-2">
          {keyFeatures.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
