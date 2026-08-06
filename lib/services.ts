import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Cloud,
  Cpu,
  Layers,
  LayoutGrid,
  Lightbulb,
} from "lucide-react";

export type ServiceCategory = {
  id: string;
  title: string;
  tagline: string;
  details: string[];
  icon: LucideIcon;
  accent: string;
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "it-consulting",
    title: "IT Consulting & Strategy",
    tagline: "Expert guidance to align your IT infrastructure with business goals.",
    details: [
      "Digital Transformation Planning",
      "IT Budgeting & Cost Optimization",
      "Cloud Strategy (AWS, Azure, Google Cloud)",
      "Technology Roadmap Development",
    ],
    icon: Lightbulb,
    accent: "from-blue-500 to-cyan-500",
  },
  {
    id: "custom-apps",
    title: "Apps Built for You",
    tagline: "Custom-built applications to solve your unique business challenges.",
    details: [
      "Tailored software design to fit your specific workflows.",
      "Web and Mobile application development.",
      "Scalable architecture that grows with your company.",
      "User-focused interface design.",
    ],
    icon: LayoutGrid,
    accent: "from-brand-500 to-indigo-600",
  },
  {
    id: "system-integration",
    title: "System Integration",
    tagline: "Seamlessly connecting your software, platforms, and data.",
    details: [
      "API Development & Management.",
      "Modernization of legacy systems.",
      "Third-party software integration.",
      "Automated data synchronization.",
    ],
    icon: Layers,
    accent: "from-emerald-500 to-teal-600",
  },
  {
    id: "automation-ai",
    title: "Smart Automation & AI",
    tagline: "Boosting efficiency through intelligent automation and AI-driven workflows.",
    details: [
      "Streamlined business process automation.",
      "Reduction of manual, repetitive tasks.",
      "Custom AI solutions for business intelligence.",
      "Predictive analytics implementation.",
    ],
    icon: Cpu,
    accent: "from-amber-500 to-orange-600",
  },
  {
    id: "data-analytics",
    title: "Data & Analytics",
    tagline: "Turning your raw data into actionable business insights.",
    details: [
      "Interactive Business Intelligence (BI) Dashboards.",
      "Data Warehousing design and management.",
      "AI & Machine Learning model integration.",
      "Comprehensive data governance policies.",
    ],
    icon: BarChart3,
    accent: "from-sky-500 to-cyan-600",
  },
  {
    id: "cloud-services",
    title: "Cloud Services",
    tagline: "Reliable and scalable cloud infrastructure for modern enterprises.",
    details: [
      "Full-cycle Cloud Migration.",
      "Infrastructure as a Service (IaaS) management.",
      "Cloud performance tuning and cost management.",
      "Disaster Recovery and Data Backup solutions.",
    ],
    icon: Cloud,
    accent: "from-indigo-500 to-blue-600",
  },
];

export const whyChooseUs = [
  {
    title: "Fast Delivery",
    description:
      "We prioritize agile development to get your solutions to market faster without compromising quality.",
  },
  {
    title: "Built and Run by the Same People",
    description:
      "You talk directly to the team that designs, ships, and operates your system — no handoffs, no ticket queues.",
  },
  {
    title: "Proven in Production",
    description:
      "Seven of our products run real businesses today — CRM, dispatch, payments, compliance, and voice AI.",
  },
] as const;

/** Standalone apps & solutions — each sold separately (e.g. CRM is one app). */
export const featuredSolutions = [
  { label: "CRM", id: "custom-apps", color: "from-blue-400 to-cyan-400" },
  { label: "Voice AI Agent", id: "automation-ai", color: "from-brand-400 to-indigo-400" },
  { label: "Report Generator", id: "data-analytics", color: "from-amber-400 to-orange-400" },
  { label: "E-Signing Portal", id: "custom-apps", color: "from-sky-400 to-cyan-400" },
  { label: "QuickBooks Payment", id: "system-integration", color: "from-emerald-400 to-teal-400" },
  { label: "GPS Fleet Tracking", id: "custom-apps", color: "from-teal-400 to-emerald-400" },
] as const;

export const servicesPageHeader = {
  title: "Our Services",
  subtitle: "Comprehensive IT solutions designed to drive your business forward.",
} as const;
