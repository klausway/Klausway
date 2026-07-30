import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "notice"; text: string };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  title: string;
  updated: string;
  introduction: LegalBlock[];
  sections: LegalSection[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function parseBlocks(lines: string[]): LegalBlock[] {
  const blocks: LegalBlock[] = [];
  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    blocks.push({ type: "list", ...list });
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line || line === "---") {
      flushParagraph();
      flushList();
      continue;
    }

    const unordered = line.match(/^-\s+(.+)$/);
    const ordered = line.match(/^\d+\.\s+(.+)$/);
    const listMatch = unordered ?? ordered;

    if (listMatch) {
      flushParagraph();
      const isOrdered = Boolean(ordered);
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push(listMatch[1]);
      continue;
    }

    flushList();

    const notice = line.match(/^\*([^*].+)\*$/);
    if (notice) {
      flushParagraph();
      blocks.push({ type: "notice", text: notice[1] });
      continue;
    }

    paragraph.push(line);
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function loadLegalDocument(fileName: string): LegalDocument {
  const markdown = readFileSync(join(process.cwd(), fileName), "utf8");
  const lines = markdown.split(/\r?\n/);
  const title = lines[0]?.replace(/^#\s+/, "").trim() || "Legal";
  const updated =
    lines.find((line) => /^\*\*(Last updated|Revised):/.test(line))?.match(
      /:\s*(.+?)\*\*$/,
    )?.[1] ?? "";

  const content = lines.slice(1).filter((line) => {
    if (/^\*\*(Last updated|Revised):/.test(line)) return false;
    if (/^\d+\.\s+\[.+\]\(#.+\)$/.test(line.trim())) return false;
    if (/^\*\*\[Cookie Notice\]\(#cookie-notice\)\*\*$/.test(line.trim())) {
      return false;
    }
    return true;
  });

  const introductionLines: string[] = [];
  const sections: LegalSection[] = [];
  let current: LegalSection | null = null;
  let currentLines: string[] = [];

  const flushSection = () => {
    if (!current) return;
    current.blocks = parseBlocks(currentLines);
    sections.push(current);
    current = null;
    currentLines = [];
  };

  for (const rawLine of content) {
    const line = rawLine.trim();
    const markdownHeading = line.match(/^##\s+(.+?)(?:\s+\{#([^}]+)\})?$/);
    const termsHeading = line.match(/^\*\*(\d+\.\s+[^*]+)\*\*$/);

    if (markdownHeading || termsHeading) {
      flushSection();
      const sectionTitle = (markdownHeading?.[1] ?? termsHeading?.[1] ?? "").trim();
      current = {
        id: markdownHeading?.[2] ?? slugify(sectionTitle),
        title: sectionTitle,
        blocks: [],
      };
      continue;
    }

    if (current) currentLines.push(rawLine);
    else introductionLines.push(rawLine);
  }

  flushSection();

  return {
    title,
    updated,
    introduction: parseBlocks(introductionLines),
    sections,
  };
}
