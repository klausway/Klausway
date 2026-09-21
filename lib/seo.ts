import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { assetPath } from "@/lib/asset-path";
import { routes } from "@/lib/navigation";

const DEFAULT_SITE_URL = "https://www.klausway.com";
const PRODUCTION_HOST = "www.klausway.com";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function isNonPublicHostname(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "0.0.0.0" ||
    host === "::1" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local")
  ) {
    return true;
  }
  return (
    /^10(?:\.\d{1,3}){3}$/.test(host) ||
    /^192\.168(?:\.\d{1,3}){2}$/.test(host) ||
    /^172\.(1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}$/.test(host) ||
    /^169\.254(?:\.\d{1,3}){2}$/.test(host)
  );
}

/**
 * Public site origin used for canonical, Open Graph, JSON-LD, and sitemap.
 * Localhost / private NEXT_PUBLIC_SITE_URL values are ignored so a mis-set
 * Vercel env cannot ship http://localhost into production metadata.
 */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      const parsed = new URL(raw.includes("://") ? raw : `https://${raw}`);
      if (!isNonPublicHostname(parsed.hostname)) {
        if (
          parsed.hostname === "klausway.com" ||
          parsed.hostname === "www.klausway.com"
        ) {
          return `https://${PRODUCTION_HOST}`;
        }
        const path =
          parsed.pathname === "/" ? "" : stripTrailingSlash(parsed.pathname);
        return `${parsed.origin}${path}`;
      }
    } catch {
      // Fall through to the production default.
    }
  }

  return DEFAULT_SITE_URL;
}

export const siteConfig = {
  name: brand.name,
  tagline: brand.tagline,
  title: `${brand.name} — Strategic IT Solutions for Business Growth`,
  description:
    "Comprehensive IT solutions designed to drive your business forward. IT consulting, custom apps, system integration, smart automation, data analytics, and cloud services.",
  locale: "en_US",
  language: "en-US",
  email: "support@klausway.com",
  phone: "+1-860-400-0758",
  phoneDisplay: "(860) 400-0758",
  address: {
    streetAddress: "29 Northridge Drive",
    addressLocality: "North Windham",
    addressRegion: "CT",
    postalCode: "06256",
    addressCountry: "US",
  },
  defaultOgImage: "/og.png",
  logoImage: "/Logo.jpg",
  keywords: [
    "Klaus Way",
    "Worknex",
    "ApronConnect",
    "IT consulting",
    "custom software",
    "CRM",
    "system integration",
    "business automation",
    "cloud migration",
    "data analytics",
  ],
} as const;

/** Absolute page URL (respects trailingSlash + site URL that may include basePath). */
export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  return `${base}${withSlash}`;
}

/** Absolute asset/OG image URL (handles GitHub Pages basePath + remote S3 URLs). */
export function absoluteImageUrl(imagePath?: string | null): string {
  if (imagePath?.startsWith("http://") || imagePath?.startsWith("https://")) {
    return imagePath;
  }
  const path = imagePath || siteConfig.defaultOgImage;
  const site = new URL(getSiteUrl());
  return `${site.origin}${assetPath(path.startsWith("/") ? path : `/${path}`)}`;
}

type BuildPageMetadataOptions = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  type?: "website" | "article";
  keywords?: string[];
  noIndex?: boolean;
  /** When set, this page points SEO at another URL (e.g. a dedicated product site). */
  canonicalUrl?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  keywords,
  noIndex = false,
  canonicalUrl,
  publishedTime,
  modifiedTime,
  authors,
}: BuildPageMetadataOptions): Metadata {
  const url = canonicalUrl ?? absoluteUrl(path);
  const ogImage = absoluteImageUrl(image);
  const fullTitle =
    title === siteConfig.title ? title : `${title} · ${siteConfig.name}`;

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} — ${title}`,
        },
      ],
      ...(type === "article" && publishedTime
        ? {
            publishedTime,
            modifiedTime: modifiedTime ?? publishedTime,
            authors: authors ?? [siteConfig.name],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}

export function organizationJsonLd() {
  const logo = absoluteImageUrl(siteConfig.logoImage);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${getSiteUrl()}/#organization`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: logo,
    },
    image: logo,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      email: siteConfig.email,
      areaServed: "US",
      availableLanguage: ["English"],
    },
    sameAs: [
      "https://www.linkedin.com/company/klaus-way-technology",
      "https://www.work-nex.com",
      "https://www.apronconnect.com",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    name: siteConfig.name,
    url: absoluteUrl("/"),
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      "@id": `${getSiteUrl()}/#organization`,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function resourceTypeKeywords(type?: string | null): string[] {
  const base = [...siteConfig.keywords];
  switch (type) {
    case "guide":
      return [...base, "how-to guide", "business process guide", "IT playbook"];
    case "news":
      return [...base, "industry news", "technology news"];
    case "case-study":
      return [...base, "case study", "customer success", "digital transformation"];
    default:
      return [...base, "IT insights", "operations modernization"];
  }
}

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  updatedAt?: string;
  coverImage?: string | null;
  type?: string;
}) {
  const url = absoluteUrl(`${routes.resources}/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": post.type === "news" ? "NewsArticle" : "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    keywords: resourceTypeKeywords(post.type).join(", "),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    image: absoluteImageUrl(post.coverImage),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteImageUrl(siteConfig.logoImage),
      },
    },
  };
}

export function portfolioProjectJsonLd(project: {
  id: string;
  title: string;
  description: string;
  overview: string;
  categories: string[];
  tags: string[];
  coverImage?: string | null;
}) {
  const url = absoluteUrl(`${routes.portfolio}/${project.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.overview || project.description,
    url,
    image: absoluteImageUrl(project.coverImage),
    keywords: [...project.categories, ...project.tags].join(", "),
    genre: project.categories.join(", "),
    creator: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
  };
}

export function softwareApplicationJsonLd(product: {
  id: string;
  name: string;
  tagline: string;
  overview: string;
  tags: string[];
  image: string;
  productUrl?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.overview || product.tagline,
    url: product.productUrl || absoluteUrl(`${routes.products}/${product.id}`),
    image: absoluteImageUrl(product.image),
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    keywords: product.tags.join(", "),
    author: {
      "@type": "Organization",
      name: siteConfig.name,
      url: absoluteUrl("/"),
    },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
    },
  };
}

export function professionalServiceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    image: absoluteImageUrl(siteConfig.logoImage),
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      ...siteConfig.address,
    },
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
    priceRange: "$$",
  };
}
