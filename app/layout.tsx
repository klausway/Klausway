import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/google-analytics";
import { LayoutShell } from "@/components/layout-shell";
import { JsonLd } from "@/components/json-ld";
import { assetPath } from "@/lib/asset-path";
import {
  absoluteImageUrl,
  absoluteUrl,
  getSiteUrl,
  organizationJsonLd,
  professionalServiceJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";
import "./globals.css";

const ogImage = absoluteImageUrl(siteConfig.defaultOgImage);

export const metadata: Metadata = {
  metadataBase: new URL(`${getSiteUrl()}/`),
  icons: {
    icon: assetPath("/Logo.jpg"),
    apple: assetPath("/Logo.jpg"),
  },
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
  },
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
    title: `${siteConfig.name} — Strategic IT Solutions`,
    description:
      "Transform your digital infrastructure with custom apps, integration, automation, and cloud expertise.",
    url: absoluteUrl("/"),
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Strategic IT Solutions`,
    description:
      "Transform your digital infrastructure with custom apps, integration, automation, and cloud expertise.",
    images: [ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={siteConfig.language} className="light" suppressHydrationWarning>
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
