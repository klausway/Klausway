import type { Metadata } from "next";
import localFont from "next/font/local";
import { GoogleAnalytics } from "@/components/google-analytics";
import { LayoutShell } from "@/components/layout-shell";
import { JsonLd } from "@/components/json-ld";
import {
  absoluteImageUrl,
  absoluteUrl,
  feedUrl,
  getSiteUrl,
  organizationJsonLd,
  professionalServiceJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

// Self-hosted via next/font/local — avoids Turbopack failures when Google
// Fonts returns extensionless /l/font?kit= URLs to next/font/google.
const inter = localFont({
  src: "./fonts/inter-latin-wght.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
});
const spaceGrotesk = localFont({
  src: "./fonts/space-grotesk-latin-wght.woff2",
  weight: "500 700",
  style: "normal",
  variable: "--font-display",
  display: "swap",
});
const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght.woff2",
  weight: "400 500",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
});

const ogImage = absoluteImageUrl(siteConfig.defaultOgImage);
const googleSiteVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingSiteVerification = process.env.BING_SITE_VERIFICATION?.trim();

export const metadata: Metadata = {
  metadataBase: new URL(`${getSiteUrl()}/`),
  title: {
    default: siteConfig.title,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name, url: absoluteUrl("/") }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  applicationName: siteConfig.name,
  category: "technology",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: absoluteUrl("/"),
    types: {
      "application/rss+xml": feedUrl(),
    },
  },
  ...(googleSiteVerification || bingSiteVerification
    ? {
        verification: {
          ...(googleSiteVerification ? { google: googleSiteVerification } : {}),
          ...(bingSiteVerification
            ? { other: { "msvalidate.01": bingSiteVerification } }
            : {}),
        },
      }
    : {}),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [ogImage],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=2", sizes: "any" },
      { url: "/icon.png?v=2", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png?v=2", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={siteConfig.language}
      className={`light ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body
        className="min-h-screen bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(), professionalServiceJsonLd()]} />
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
