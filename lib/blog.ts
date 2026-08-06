export type ResourceType = "article" | "guide" | "news" | "case-study";

export const resourceTypes: ResourceType[] = [
  "article",
  "guide",
  "news",
  "case-study",
];

export const resourceTypeLabels: Record<ResourceType, string> = {
  article: "Article",
  guide: "Guide",
  news: "News",
  "case-study": "Case Study",
};

/** Prisma enum ↔ public/API string */
export function toPrismaResourceType(
  type: ResourceType | string | null | undefined,
): "ARTICLE" | "GUIDE" | "NEWS" | "CASE_STUDY" {
  switch (type) {
    case "guide":
    case "GUIDE":
      return "GUIDE";
    case "news":
    case "NEWS":
      return "NEWS";
    case "case-study":
    case "CASE_STUDY":
      return "CASE_STUDY";
    default:
      return "ARTICLE";
  }
}

export function fromPrismaResourceType(
  type: string | null | undefined,
): ResourceType {
  switch (type) {
    case "GUIDE":
    case "guide":
      return "guide";
    case "NEWS":
    case "news":
      return "news";
    case "CASE_STUDY":
    case "case-study":
      return "case-study";
    default:
      return "article";
  }
}

export const resourcesPageHeader = {
  title: "Resources",
  subtitle:
    "Guides, articles, news, and case studies to help you modernize operations, apps, and IT.",
};

export type ResourcePost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /** ISO date when the CMS/curator last updated the post (SEO freshness). */
  updatedAt?: string;
  type: ResourceType;
  coverImage?: string | null;
  galleryImages?: string[];
};

/** @deprecated Use ResourcePost — kept for gradual migration */
export type BlogPost = ResourcePost;

export const resourcePosts: ResourcePost[] = [
  {
    slug: "many-businesses-still-rely-on-filemaker",
    title: "Many Businesses Still Rely on FileMaker — And for Good Reasons",
    excerpt:
      "FileMaker has supported business operations for decades. Its flexibility, customization capabilities, and stability make it a practical and strategic choice for many organizations — not a sign of outdated technology.",
    date: "2024-11-12",
    type: "article",
  },
  {
    slug: "unmanaged-systems-carry-risks",
    title: 'Unmanaged Systems Carry Risks — Even When They Still "Work"',
    excerpt:
      "Many legacy systems continue operating without visible issues, but unmanaged systems quietly accumulate technical, security, and operational risks. Regular system reviews help businesses detect vulnerabilities early and prevent costly disruptions.",
    date: "2024-10-28",
    type: "article",
  },
  {
    slug: "what-is-smart-automation",
    title: "What Is Smart Automation?",
    excerpt:
      "Smart automation combines automation technologies, AI, and system integration to execute business processes with minimal human intervention.",
    date: "2024-10-15",
    type: "guide",
  },
  {
    slug: "future-of-content-management-systems-2024",
    title: "The Future of Content Management Systems in 2024",
    excerpt:
      "Explore the latest trends and innovations shaping the future of CMS platforms and how businesses can leverage them.",
    date: "2024-09-20",
    type: "article",
  },
  {
    slug: "cybersecurity-best-practices",
    title: "Cybersecurity Best Practices for Modern Businesses",
    excerpt:
      "Essential security measures every business should implement to protect their digital assets from evolving threats.",
    date: "2024-09-05",
    type: "guide",
  },
  {
    slug: "cloud-migration-complete-guide",
    title: "Cloud Migration: A Complete Guide for Enterprises",
    excerpt:
      "Step-by-step guide to successfully migrating your enterprise infrastructure to the cloud with minimal disruption.",
    date: "2024-08-18",
    type: "guide",
  },
  {
    slug: "headless-cms-vs-traditional-cms",
    title: "Headless CMS vs Traditional CMS: Which is Right for You?",
    excerpt:
      "A comprehensive comparison of headless and traditional CMS architectures to help you make the right choice.",
    date: "2024-08-02",
    type: "article",
  },
  {
    slug: "ai-machine-learning-it-infrastructure",
    title: "AI and Machine Learning in IT Infrastructure",
    excerpt:
      "How artificial intelligence is revolutionizing IT operations and infrastructure management.",
    date: "2024-07-14",
    type: "article",
  },
];

/** @deprecated Use resourcePosts */
export const blogPosts = resourcePosts;

/** @deprecated Use resourcesPageHeader */
export const blogPageHeader = resourcesPageHeader;

export function getResourcePost(slug: string): ResourcePost | undefined {
  return resourcePosts.find((post) => post.slug === slug);
}

/** @deprecated Use getResourcePost */
export function getBlogPost(slug: string): ResourcePost | undefined {
  return getResourcePost(slug);
}
