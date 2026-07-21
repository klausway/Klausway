const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
]);

const VOID_TAGS = new Set(["br"]);

export function isRichTextHtml(value: string) {
  return /<[a-z][\s\S]*>/i.test(value.trim());
}

export function plainTextToHtml(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";

  return trimmed
    .split(/\n{2,}/)
    .map((paragraph) => {
      const escaped = paragraph
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");
      return `<p>${escaped}</p>`;
    })
    .join("");
}

export function normalizeRichText(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  return isRichTextHtml(trimmed) ? trimmed : plainTextToHtml(trimmed);
}

function sanitizeHref(href: string): string | null {
  const trimmed = href.trim();
  if (!trimmed) return null;
  if (/^(https?:|mailto:|\/|#)/i.test(trimmed)) return trimmed;
  return null;
}

function readAttr(attrs: string, name: string): string | null {
  const match = attrs.match(
    new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"),
  );
  return match?.[2] ?? match?.[3] ?? match?.[4] ?? null;
}

function escapeAttr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Allowlist HTML sanitizer for CMS rich text.
 * Avoids isomorphic-dompurify/jsdom, which breaks on Vercel (ERR_REQUIRE_ESM).
 */
export function sanitizeRichText(value: string) {
  const input = normalizeRichText(value);
  if (!input) return "";

  let html = input
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
    .replace(/<(script|style)\b[^>]*\/?>/gi, "");

  // Rewrite anchors first so unsafe hrefs unwrap to plain text.
  html = html.replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, (_match, rawAttrs: string, inner: string) => {
    const href = sanitizeHref(readAttr(rawAttrs, "href") ?? "");
    if (!href) return inner;
    const target = readAttr(rawAttrs, "target");
    if (target === "_blank") {
      return `<a href="${escapeAttr(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
    }
    return `<a href="${escapeAttr(href)}">${inner}</a>`;
  });

  return html.replace(
    /<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^>]*)>/g,
    (match, rawTag: string) => {
      const tag = rawTag.toLowerCase();
      if (tag === "a") return match; // already sanitized above
      if (!ALLOWED_TAGS.has(tag)) return "";

      const isClosing = match.startsWith("</");
      if (isClosing) return `</${tag}>`;
      if (VOID_TAGS.has(tag)) return `<${tag}>`;
      return `<${tag}>`;
    },
  );
}

export function richTextToPlainText(value: string) {
  const html = sanitizeRichText(value);
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
