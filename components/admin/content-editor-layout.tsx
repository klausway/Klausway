"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/admin-ui";

export type EditorTab = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type ContentEditorLayoutProps = {
  title: string;
  isNew?: boolean;
  published: boolean;
  publicPath?: string;
  tabs: EditorTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onBack: () => void;
  preview: React.ReactNode;
  footer: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Fixed chrome (header + footer) with a scrollable middle pane so the
 * sticky footer never covers form fields.
 */
export function ContentEditorLayout({
  title,
  isNew,
  published,
  publicPath,
  tabs,
  activeTab,
  onTabChange,
  onBack,
  preview,
  footer,
  children,
}: ContentEditorLayoutProps) {
  return (
    <div className="-mx-4 -my-4 flex h-[calc(100%+2rem)] min-h-0 flex-1 flex-col overflow-hidden lg:-mx-8">
      <header className="shrink-0 border-b border-black/10 bg-background px-4 pb-3 pt-1 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-black/15 hover:bg-black/[0.04] hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">
                {title}
              </h2>
              <StatusBadge published={published} />
              {isNew ? (
                <span className="rounded-full bg-brand-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-700">
                  New
                </span>
              ) : null}
            </div>
          </div>

          {publicPath ? (
            <a
              href={publicPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-1.5 text-xs font-medium text-brand-600 transition-colors hover:border-brand-400/30 hover:bg-brand-500/10"
            >
              View on site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
        </div>

        <nav className="mt-3 flex gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-brand-500/15 text-brand-800 ring-1 ring-brand-400/25"
                    : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-brand-600")} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid gap-6 px-4 py-5 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 xl:grid-cols-[minmax(0,1fr)_400px]">
          <div className="min-w-0">
            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
              {children}
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-4 lg:self-start">
            <div className="h-[min(560px,70vh)]">{preview}</div>
          </aside>
        </div>
      </div>

      <footer className="shrink-0 border-t border-black/10 bg-background px-4 py-3 lg:px-8">
        {footer}
      </footer>
    </div>
  );
}

export function EditorSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-base font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function EditorFieldGrid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: 1 | 2;
}) {
  return (
    <div className={cn("grid gap-4", cols === 2 && "sm:grid-cols-2")}>
      {children}
    </div>
  );
}

export function EditorListFields({
  items,
}: {
  items: { title: string; description?: string; content: React.ReactNode }[];
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.title}
          className="rounded-xl border border-black/10 bg-black/[0.02] p-4"
        >
          <p className="text-sm font-medium">{item.title}</p>
          {item.description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {item.description}
            </p>
          ) : null}
          <div className="mt-3">{item.content}</div>
        </div>
      ))}
    </div>
  );
}
