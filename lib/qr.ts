import { getSiteUrl } from "@/lib/seo";

export const QR_PATH_PREFIX = "/q";

/** Codes that must keep resolving even if the DB row is missing — they may already be printed. */
export const defaultQrCodes = [
  {
    slug: "contact",
    name: "Contact page",
    destination:
      "/contact/?utm_source=qr&utm_medium=print&utm_campaign=contact",
  },
] as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Public short URL encoded in the QR image. */
export function qrShortUrl(slug: string) {
  return `${getSiteUrl()}${QR_PATH_PREFIX}/${slug}/`;
}

export type QrInput = {
  slug: string;
  name: string;
  destination: string;
  active: boolean;
};

export function parseQrInput(
  body: Record<string, unknown>,
): { data: QrInput } | { error: string } {
  const slug = String(body.slug ?? "").trim().toLowerCase();
  const name = String(body.name ?? "").trim();
  const destination = String(body.destination ?? "").trim();

  if (!SLUG_PATTERN.test(slug) || slug.length > 64) {
    return { error: "Slug may only contain lowercase letters, numbers, and dashes." };
  }
  if (!name) return { error: "Name is required." };
  if (!isValidDestination(destination)) {
    return { error: "Destination must be a site path like /contact/ or a full https:// URL." };
  }

  return {
    data: { slug, name, destination, active: body.active !== false },
  };
}

function isValidDestination(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
