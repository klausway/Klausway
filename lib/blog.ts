export const blogPageHeader = {
  subtitle:
    "Insights, tips, and best practices from our team of IT experts",
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage?: string | null;
  galleryImages?: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "many-businesses-still-rely-on-filemaker",
    title: "Many Businesses Still Rely on FileMaker — And for Good Reasons",
    excerpt:
      "FileMaker has supported business operations for decades. Its flexibility, customization capabilities, and stability make it a practical and strategic choice for many organizations — not a sign of outdated technology.",
    date: "2024-11-12",
  },
  {
    slug: "unmanaged-systems-carry-risks",
    title: 'Unmanaged Systems Carry Risks — Even When They Still "Work"',
    excerpt:
      "Many legacy systems continue operating without visible issues, but unmanaged systems quietly accumulate technical, security, and operational risks. Regular system reviews help businesses detect vulnerabilities early and prevent costly disruptions.",
    date: "2024-10-28",
  },
  {
    slug: "what-is-smart-automation",
    title: "What Is Smart Automation?",
    excerpt:
      "Smart automation combines automation technologies, AI, and system integration to execute business processes with minimal human intervention.",
    date: "2024-10-15",
  },
  {
    slug: "future-of-content-management-systems-2024",
    title: "The Future of Content Management Systems in 2024",
    excerpt:
      "Explore the latest trends and innovations shaping the future of CMS platforms and how businesses can leverage them.",
    date: "2024-09-20",
  },
  {
    slug: "cybersecurity-best-practices",
    title: "Cybersecurity Best Practices for Modern Businesses",
    excerpt:
      "Essential security measures every business should implement to protect their digital assets from evolving threats.",
    date: "2024-09-05",
  },
  {
    slug: "cloud-migration-complete-guide",
    title: "Cloud Migration: A Complete Guide for Enterprises",
    excerpt:
      "Step-by-step guide to successfully migrating your enterprise infrastructure to the cloud with minimal disruption.",
    date: "2024-08-18",
  },
  {
    slug: "headless-cms-vs-traditional-cms",
    title: "Headless CMS vs Traditional CMS: Which is Right for You?",
    excerpt:
      "A comprehensive comparison of headless and traditional CMS architectures to help you make the right choice.",
    date: "2024-08-02",
  },
  {
    slug: "ai-machine-learning-it-infrastructure",
    title: "AI and Machine Learning in IT Infrastructure",
    excerpt:
      "How artificial intelligence is revolutionizing IT operations and infrastructure management.",
    date: "2024-07-14",
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
