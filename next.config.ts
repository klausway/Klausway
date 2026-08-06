import type { NextConfig } from "next";
import path from "path";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/Klausway" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export only for GitHub Pages; server mode enables app/api routes + DB.
  ...(isGitHubPages ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  // Parent ~/package-lock.json otherwise becomes Turbopack root and breaks Prisma.
  turbopack: {
    root: path.join(__dirname),
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // Static export has no API routes — the contact form falls back to mailto.
    NEXT_PUBLIC_STATIC_EXPORT: isGitHubPages ? "true" : "",
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/blog",
        destination: "/resources/",
        permanent: true,
      },
      {
        source: "/blog/",
        destination: "/resources/",
        permanent: true,
      },
      {
        source: "/blog/:slug",
        destination: "/resources/:slug/",
        permanent: true,
      },
      {
        source: "/blog/:slug/",
        destination: "/resources/:slug/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
