import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/Klausway" : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static export only for GitHub Pages; server mode enables app/api routes + DB.
  ...(isGitHubPages ? { output: "export" as const } : {}),
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
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
