export type PortfolioCategory =
  | "AI/ML"
  | "Analytics"
  | "CRM"
  | "Document Management"
  | "Payment"
  | "Tracking";

export type PortfolioProject = {
  id: string;
  title: string;
  description: string;
  overview: string;
  categories: PortfolioCategory[];
  tags: string[];
  accent: string;
  keyFeatures: string[];
  benefits: string[];
  useCases: string[];
  coverImage?: string | null;
  galleryImages?: string[];
};

export const portfolioCategories: PortfolioCategory[] = [
  "AI/ML",
  "Analytics",
  "CRM",
  "Document Management",
  "Payment",
  "Tracking",
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "crm",
    title: "CRM",
    description:
      "Full-cycle CRM for contacts, addresses, products, tasks, and the handoff from sales to operations.",
    overview:
      "Built for a Connecticut home-services operator drowning in spreadsheets and three disconnected tools. We shipped a single CRM that owns contacts, job addresses with map pins, product catalogs, and a task studio for the office. Sales and production work from the same customer record — no re-keying, no lost notes. The dashboard surfaces pipeline health and open work so managers see the week without asking for a status meeting.",
    categories: ["CRM"],
    tags: ["CRM", "Contact Management", "Task Management"],
    accent: "from-cyan-400 to-blue-500",
    coverImage: "/products/klaus-connect.png",
    galleryImages: [
      "/products/klaus-connect-2.png",
      "/products/klaus-connect-3.png",
    ],
    keyFeatures: [
      "Centralized dashboard for business overview and analytics",
      "Address management with interactive map integration",
      "Product catalog and inventory management",
      "Task studio for workflow automation and project management",
      "Contact and customer relationship tracking",
      "Secure authentication and user management",
    ],
    benefits: [
      "Centralize all customer data in one platform",
      "Improve team collaboration and productivity",
      "Better customer relationship management",
      "Streamlined business operations",
      "Data-driven decision making with analytics",
    ],
    useCases: [
      "Sales teams managing customer relationships",
      "Businesses tracking customer interactions",
      "Companies managing product catalogs",
      "Organizations coordinating tasks and projects",
    ],
  },
  {
    id: "report-generator",
    title: "Report Generator",
    description:
      "Custom report builder with multi-page layouts, history, and export — built for teams that outgrew canned dashboards.",
    overview:
      "A regional distributor needed weekly ops packs that finance, sales, and warehouse could each shape differently. We built a report generator with drag-ready page layouts, saved templates, full run history, and role-based access. Teams assemble the pages they need, regenerate on a schedule, and export without waiting on IT. What used to be a Friday scramble is now a reusable pack anyone can refresh.",
    categories: ["Analytics"],
    tags: ["Report Generation", "Data Visualization", "Business Intelligence"],
    accent: "from-brand-400 to-indigo-500",
    keyFeatures: [
      "Custom report creation and design",
      "Multi-page report management",
      "Report history tracking and version control",
      "Secure authentication and access control",
      "Export capabilities in multiple formats",
      "Template-based report generation",
    ],
    benefits: [
      "Create reports tailored to specific business needs",
      "Track and manage report history efficiently",
      "Improve data presentation and visualization",
      "Save time with template-based generation",
      "Enhanced decision-making with comprehensive reports",
    ],
    useCases: [
      "Business intelligence and analytics teams",
      "Financial reporting departments",
      "Operations and performance monitoring",
      "Executive reporting and dashboards",
    ],
  },
  {
    id: "upload-file",
    title: "Upload File",
    description:
      "Secure, permissioned file upload and organization baked into a custom application — not a bolted-on drive link.",
    overview:
      "A field-service company was emailing PDFs and dropping folders on shared drives with no audit trail. We embedded a secure upload system in their custom app: authenticated uploads, folder organization, progress feedback, and permissioned access per role. Crews and office staff put documents where the job lives. Retrieval stopped being a scavenger hunt, and sensitive files stopped floating in inboxes.",
    categories: ["Document Management"],
    tags: ["File Management", "Document Storage", "Cloud Storage"],
    accent: "from-blue-400 to-indigo-500",
    keyFeatures: [
      "Secure file upload with authentication",
      "Multiple file format support",
      "File organization and management",
      "Cloud-based storage integration",
      "User access control and permissions",
      "File upload progress tracking",
    ],
    benefits: [
      "Secure document storage and management",
      "Easy file organization and retrieval",
      "Improved collaboration through centralized storage",
      "Reduced storage costs with cloud integration",
      "Enhanced security with access controls",
    ],
    useCases: [
      "Document management systems",
      "Content management platforms",
      "Business document storage",
      "File sharing and collaboration tools",
    ],
  },
  {
    id: "lead-pipeline",
    title: "Perfect Your Lead-to-Customer Pipeline",
    description:
      "End-to-end lead status, stage gates, and conversion tracking so every prospect has an owner and a next step.",
    overview:
      "A multi-crew contracting business was losing leads between the website, the phone, and the estimator’s notebook. We built a lead-to-customer pipeline with mandatory stages, ownership, and ROI visibility at every step. Marketing sees which campaigns convert; sales sees what’s stuck; leadership sees the funnel without a spreadsheet merge. The rule is simple: every lead has a status, an owner, and a next action.",
    categories: ["CRM"],
    tags: ["CRM", "Lead Management", "Sales Pipeline"],
    accent: "from-sky-400 to-cyan-500",
    coverImage: "/products/klaus-connect-2.png",
    galleryImages: [
      "/products/klaus-connect.png",
      "/products/klaus-connect-3.png",
    ],
    keyFeatures: [
      "Complete lead status tracking and visibility",
      "Pipeline management for lead progression",
      "ROI optimization through proper lead nurturing",
      "Automated workflow for lead qualification",
      "Conversion tracking and analytics",
      "Integration with sales and marketing tools",
    ],
    benefits: [
      "Maximize conversion rates and ROI",
      "Ensure no leads fall through the cracks",
      "Improve sales team productivity",
      "Better forecasting and pipeline management",
      "Data-driven sales strategy optimization",
    ],
    useCases: [
      "Sales teams managing lead conversion",
      "Marketing departments tracking campaign ROI",
      "Business development and account management",
      "Customer acquisition and growth teams",
    ],
  },
  {
    id: "inventory-management",
    title: "Inventory Management",
    description:
      "Warehouse and job-site inventory with replenishment alerts, POs, and returns tied to the work that consumed stock.",
    overview:
      "A trades company kept running out of high-turn SKUs on jobs while overstocking the warehouse. We connected inventory to jobs: move stock through the warehouse, attach usage to specific work orders, watch replenishment levels, raise purchase orders, and process unused returns at the job level. Purchasing and production finally share one count — not two spreadsheets that disagree by Friday.",
    categories: ["Tracking"],
    tags: ["Inventory Control", "Warehouse Management", "Supply Chain"],
    accent: "from-emerald-400 to-teal-500",
    coverImage: "/products/dispatcher.png",
    galleryImages: [
      "/products/dispatcher-2.png",
      "/products/dispatcher-3.png",
    ],
    keyFeatures: [
      "Warehouse and business location inventory tracking",
      "Job-specific transaction connections",
      "Automated replenishment level monitoring",
      "Purchase order generation to suppliers",
      "Job-level return processing for unused products",
      "Real-time inventory visibility across locations",
    ],
    benefits: [
      "Reduce inventory carrying costs",
      "Prevent stockouts and overstock situations",
      "Improve supply chain efficiency",
      "Better job cost tracking and profitability",
      "Streamlined procurement processes",
    ],
    useCases: [
      "Manufacturing and production facilities",
      "Retail and distribution centers",
      "Construction and project-based businesses",
      "Wholesale and distribution operations",
    ],
  },
  {
    id: "vehicle-tracking",
    title: "Vehicle Tracking / GPS Integration",
    description:
      "Live fleet location, path history, and speed reporting so dispatch knows where every truck is — within seconds.",
    overview:
      "A service fleet’s dispatch board was guesswork: who is closest, who is delayed, who took the long route. We integrated GPS tracking with current location, path playback, and speed reports for the day. Dispatchers place the right truck on the right job; managers review routes and behavior without calling drivers mid-route. Visibility that used to take a radio chain now takes a refresh.",
    categories: ["Tracking"],
    tags: ["GPS Tracking", "Real-time Location", "Fleet Management"],
    accent: "from-lime-400 to-green-500",
    keyFeatures: [
      "Real-time GPS vehicle tracking",
      "Current location and historical path visualization",
      "Speed monitoring and driver behavior analysis",
      "Automated reporting on driver performance",
      "Geofencing and route optimization",
      "Fleet management dashboard",
    ],
    benefits: [
      "Improve fleet efficiency and utilization",
      "Enhance driver safety and compliance",
      "Reduce fuel costs through route optimization",
      "Real-time visibility of all vehicles",
      "Data-driven fleet management decisions",
    ],
    useCases: [
      "Delivery and logistics companies",
      "Field service operations",
      "Transportation and shipping businesses",
      "Construction and equipment rental companies",
    ],
  },
  {
    id: "customer-e-signing",
    title: "Customer E-Signing",
    description:
      "Email-out e-sign from your custom app with required fields enforced before a document can complete.",
    overview:
      "Contracts and change orders were printing, scanning, and disappearing into email threads. We added customer e-signing inside the client’s application: documents go out by email, required fields must be complete before finish, and signed copies land back on the job record. Turnaround dropped from days to hours, and the office stopped chasing wet signatures.",
    categories: ["Document Management"],
    tags: ["E-Signature", "Document Management", "Workflow Automation"],
    accent: "from-amber-400 to-orange-500",
    keyFeatures: [
      "E-signature integration for document completion",
      "Email-based document delivery system",
      "Requirement validation before completion",
      "Secure document handling and storage",
      "Digital signature verification",
      "Automated workflow for document processing",
    ],
    benefits: [
      "Eliminate paper-based processes",
      "Faster document turnaround times",
      "Enhanced security and compliance",
      "Improved customer experience",
      "Reduced administrative overhead",
    ],
    useCases: [
      "Contract signing and agreement processing",
      "Service agreements and terms acceptance",
      "Legal document execution",
      "Compliance and regulatory documentation",
    ],
  },
  {
    id: "detailed-reporting",
    title: "Detailed Reporting",
    description:
      "Custom and platform-integrated reporting — from region-level profitability down to a bird’s-eye executive view.",
    overview:
      "Leadership wanted both the zoom lens and the wide shot: which regions print money, and how the whole book looks this month. We built detailed reporting that plugs into existing platforms where useful and goes fully custom where it isn’t. Granular cuts by region and metric sit next to executive dashboards. The same data answers “what’s wrong in the east” and “are we on plan.”",
    categories: ["Analytics"],
    tags: ["Data Analytics", "Custom Reports", "Business Intelligence"],
    accent: "from-indigo-400 to-violet-500",
    keyFeatures: [
      "Integration with multiple reporting platforms",
      "Completely custom reporting capabilities",
      "Granular data analysis by region and metrics",
      "Bird's eye view dashboard for executive insights",
      "Real-time data visualization",
      "Exportable reports in multiple formats",
    ],
    benefits: [
      "Identify most profitable regions and segments",
      "Make data-driven business decisions",
      "Customize reports to match specific business needs",
      "Save time with automated report generation",
      "Improve visibility across all business metrics",
    ],
    useCases: [
      "Business intelligence and analytics departments",
      "Executive dashboards for strategic planning",
      "Regional performance analysis and comparison",
      "Financial reporting and profitability analysis",
    ],
  },
  {
    id: "voice-ai-agent",
    title: "Voice AI Agent",
    description:
      "Voice-first AI agent for after-hours and high-volume customer service — natural conversation, CRM handoff included.",
    overview:
      "A growing service business was missing after-hours calls and burning agents on repetitive scheduling questions. We deployed a voice AI agent with speech recognition, natural language understanding, and context-aware conversation that books, answers FAQs, and writes outcomes back to the CRM. It handles volume without waiting on hold, and humans pick up the edge cases. Callers get a response at 9pm; the office starts the morning with structured notes instead of voicemail archaeology.",
    categories: ["AI/ML"],
    tags: ["AI/ML", "Voice Recognition", "Natural Language Processing"],
    accent: "from-teal-400 to-emerald-500",
    coverImage: "/products/klr-ai.png",
    galleryImages: ["/products/klr-ai-2.png", "/products/klr-ai-3.png"],
    keyFeatures: [
      "Advanced voice recognition with multi-language support",
      "Natural language understanding for complex queries",
      "Context-aware conversation management",
      "Machine learning capabilities for continuous improvement",
      "Integration with CRM and business systems",
      "Real-time sentiment analysis and response adaptation",
    ],
    benefits: [
      "24/7 automated customer support availability",
      "Reduced response time and improved customer satisfaction",
      "Cost-effective solution reducing human agent workload",
      "Consistent service quality across all interactions",
      "Scalable to handle high call volumes simultaneously",
    ],
    useCases: [
      "Customer service centers handling inquiries and support",
      "Call centers managing appointment scheduling",
      "E-commerce platforms providing order assistance",
      "Healthcare facilities for patient information and scheduling",
    ],
  },
  {
    id: "quickbooks-payment",
    title: "QuickBooks Payment",
    description:
      "Payment links and reconciliation wired into QuickBooks so invoices, collections, and books stay in sync.",
    overview:
      "A services firm was typing payments into QuickBooks by hand after every card charge. We built a payment flow that generates secure links, takes multi-channel payments, and syncs transactions back to QuickBooks with automated reconciliation and reporting. Invoices go out, money comes in, and the books update without a second entry. Finance got fewer mismatches; customers got a one-click pay experience.",
    categories: ["Payment"],
    tags: ["Payment Integration", "QuickBooks API", "Financial Management"],
    accent: "from-emerald-500 to-teal-600",
    coverImage: "/products/qb-payments.png",
    galleryImages: [
      "/products/qb-payments-2.png",
      "/products/qb-payments-3.png",
      "/products/qb-payments-4.png",
    ],
    keyFeatures: [
      "Seamless QuickBooks integration for real-time data synchronization",
      "Multi-channel payment processing support",
      "Automated transaction tracking and reconciliation",
      "Comprehensive financial reporting and analytics",
      "Secure payment gateway integration",
      "Customizable invoice generation and management",
    ],
    benefits: [
      "Streamlined payment workflows reducing manual data entry",
      "Real-time financial visibility and insights",
      "Improved accuracy in accounting and bookkeeping",
      "Enhanced security with encrypted transactions",
      "Scalable solution for businesses of all sizes",
    ],
    useCases: [
      "Small to medium businesses managing invoices and payments",
      "E-commerce platforms requiring payment processing",
      "Service-based companies tracking client payments",
      "Financial departments automating reconciliation processes",
    ],
  },
];

export const portfolioPageHeader = {
  title: "Our Portfolio",
  subtitle:
    "Custom systems we’ve designed, built, and put into production — CRM, reporting, payments, inventory, documents, fleet, and voice AI. Each entry includes sample screens and the full feature set.",
} as const;

export function getPortfolioProject(id: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id);
}
