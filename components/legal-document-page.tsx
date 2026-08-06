"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  CalendarDays,
  FileCheck2,
  Globe2,
  ShieldCheck,
} from "lucide-react";
import type {
  LegalBlock,
  LegalDocument,
} from "@/lib/legal-documents";

type LegalDocumentPageProps = {
  document: LegalDocument;
  kind: "privacy" | "terms";
  description: string;
};

function normalizeHref(href: string) {
  if (href === "https://www.klausway.com/privacy-policy/") {
    return "/privacy-policy";
  }
  if (href === "https://www.klausway.com/contact/") return "/contact";
  return href;
}

function renderInline(text: string) {
  const pattern = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    if (match[1] && match[2]) {
      const href = normalizeHref(match[2]);
      const className =
        "font-medium text-brand-700 underline decoration-brand-300 underline-offset-4 transition-colors hover:text-brand-900";
      nodes.push(
        href.startsWith("/") || href.startsWith("#") ? (
          <Link key={match.index} href={href} className={className}>
            {match[1]}
          </Link>
        ) : (
          <a
            key={match.index}
            href={href}
            className={className}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
          >
            {match[1]}
          </a>
        ),
      );
    } else if (match[3]) {
      nodes.push(
        <strong key={match.index} className="font-semibold text-foreground">
          {match[3]}
        </strong>,
      );
    } else if (match[4]) {
      nodes.push(<em key={match.index}>{match[4]}</em>);
    }

    cursor = pattern.lastIndex;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "list") {
          const List = block.ordered ? "ol" : "ul";
          return (
            <List
              key={index}
              className={`my-5 space-y-3 pl-6 text-[15px] leading-7 text-muted-foreground ${
                block.ordered ? "list-decimal" : "list-disc"
              } marker:font-semibold marker:text-brand-500`}
            >
              {block.items.map((item) => (
                <li key={item} className="pl-1">
                  {renderInline(item)}
                </li>
              ))}
            </List>
          );
        }

        if (block.type === "notice") {
          return (
            <aside
              key={index}
              className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-900"
            >
              <span className="font-semibold">Legal review note: </span>
              {renderInline(block.text)}
            </aside>
          );
        }

        return (
          <p
            key={index}
            className="my-4 text-[15px] leading-7 text-muted-foreground md:text-base md:leading-8"
          >
            {renderInline(block.text)}
          </p>
        );
      })}
    </>
  );
}

export function LegalDocumentPage({
  document: legalDocument,
  kind,
  description,
}: LegalDocumentPageProps) {
  const isPrivacy = kind === "privacy";
  const Icon = isPrivacy ? ShieldCheck : FileCheck2;
  const tableOfContentsRef = useRef<HTMLOListElement>(null);
  const [activeSection, setActiveSection] = useState(
    legalDocument.sections[0]?.id ?? "",
  );

  useEffect(() => {
    const sectionElements = legalDocument.sections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sectionElements.length) return;

    const updateActiveSection = () => {
      const readingLine = window.innerHeight * 0.28;
      let current = sectionElements[0];

      for (const section of sectionElements) {
        if (section.getBoundingClientRect().top <= readingLine) {
          current = section;
        } else {
          break;
        }
      }

      setActiveSection(current.id);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [legalDocument.sections]);

  useEffect(() => {
    const tableOfContents = tableOfContentsRef.current;
    const activeItem = tableOfContents?.querySelector<HTMLElement>(
      '[aria-current="location"]',
    );

    if (!tableOfContents || !activeItem) return;

    const itemTop = activeItem.offsetTop;
    const itemBottom = itemTop + activeItem.offsetHeight;
    const visibleTop = tableOfContents.scrollTop;
    const visibleBottom = visibleTop + tableOfContents.clientHeight;
    const padding = 12;

    if (itemTop < visibleTop + padding) {
      tableOfContents.scrollTo({
        top: Math.max(0, itemTop - padding),
        behavior: "smooth",
      });
    } else if (itemBottom > visibleBottom - padding) {
      tableOfContents.scrollTo({
        top: itemBottom - tableOfContents.clientHeight + padding,
        behavior: "smooth",
      });
    }
  }, [activeSection]);

  return (
    <>
      <header className="relative overflow-hidden border-b border-border pb-16 pt-32">
        
        <div className="absolute left-1/2 top-0 -z-10 h-80 w-[44rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-200/40 via-sky-100/40 to-cyan-100/40 blur-3xl" />
        <div className="mx-auto max-w-5xl px-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-200 bg-white text-brand-700 shadow-lg shadow-brand-500/10">
            <Icon className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-brand-700">
            Legal center
          </p>
          <h1 className="mt-3 text-balance font-display text-4xl font-bold tracking-tight md:text-6xl">
            {legalDocument.title}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-balance text-base leading-7 text-muted-foreground md:text-lg">
            {description}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 shadow-sm">
              <CalendarDays className="h-3.5 w-3.5 text-brand-600" />
              Updated {legalDocument.updated}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-4 py-2 shadow-sm">
              <Globe2 className="h-3.5 w-3.5 text-brand-600" />
              Applies to klausway.com
            </span>
          </div>
        </div>
      </header>

      <main id="legal-content" className="mx-auto max-w-7xl px-6 py-14 lg:px-10 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28">
            <nav
              aria-label={`${legalDocument.title} table of contents`}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                On this page
              </p>
              <ol
                ref={tableOfContentsRef}
                className="mt-4 max-h-[62vh] space-y-1 overflow-y-auto scroll-smooth pr-2"
              >
                {legalDocument.sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      aria-current={
                        activeSection === section.id ? "location" : undefined
                      }
                      onClick={() => setActiveSection(section.id)}
                      className={`relative block rounded-lg py-2 pl-4 pr-2.5 text-xs leading-5 transition-all ${
                        activeSection === section.id
                          ? "bg-brand-50 font-semibold text-brand-800"
                          : "text-muted-foreground hover:bg-brand-50/60 hover:text-brand-800"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-500 transition-opacity ${
                          activeSection === section.id
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>

            <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50/70 p-5">
              <p className="text-sm font-semibold text-brand-950">
                Have a question?
              </p>
              <p className="mt-1 text-xs leading-5 text-brand-900/70">
                Contact our team about this document or your information.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex text-xs font-semibold text-brand-700 hover:text-brand-900"
              >
                Contact Klaus Way →
              </Link>
            </div>
          </aside>

          <article className="min-w-0">
            {legalDocument.introduction.length > 0 && (
              <section className="rounded-3xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 shadow-sm md:p-9">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                    <Icon className="h-[18px] w-[18px]" />
                  </div>
                  <h2 className="text-lg font-semibold">Overview</h2>
                </div>
                <div className="mt-4">
                  <LegalBlocks blocks={legalDocument.introduction} />
                </div>
              </section>
            )}

            <div className="mt-6 space-y-6">
              {legalDocument.sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-28 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-9"
                >
                  <h2 className="text-balance text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                    {section.title}
                  </h2>
                  <div className="mt-4 border-t border-border pt-2">
                    <LegalBlocks blocks={section.blocks} />
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <a
                href="#legal-content"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground"
              >
                <ArrowUp className="h-3.5 w-3.5" />
                Back to top
              </a>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
