import DOMPurify from "isomorphic-dompurify";

const ALLOWED_TAGS = [
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
];

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

export function sanitizeRichText(value: string) {
  return DOMPurify.sanitize(normalizeRichText(value), {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
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
