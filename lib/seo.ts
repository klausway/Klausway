import type { Metadata } from "next";
import { brand } from "@/lib/brand";
import { assetPath } from "@/lib/asset-path";
import { routes } from "@/lib/navigation";

const DEFAULT_SITE_URL = "https://kotchamon-20.github.io/Klausway";

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
    "IT consulting",
    "custom software",
    "CRM",
    "system integration",
    "business automation",
    "cloud migration",
    "data analytics",
  ],
} as const;

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(
    /\/$/,
    "",
  );
}

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
  publishedTime,
  modifiedTime,
  authors,
}: BuildPageMetadataOptions): Metadata {
  const url = absoluteUrl(path);
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

export function blogPostingJsonLd(post: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
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
    dateModified: post.date,
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
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: product.name,
    description: product.overview || product.tagline,
    url: absoluteUrl(`${routes.products}/${product.id}`),
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
