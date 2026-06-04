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
      "Comprehensive customer relationship management system for managing contacts, addresses, products, and tasks.",
    overview:
      "A comprehensive customer relationship management system designed to help businesses manage all aspects of customer interactions. The system includes dashboard analytics, address management with map integration, product catalog management, and task studio for workflow automation.",
    categories: ["CRM"],
    tags: ["CRM", "Contact Management", "Task Management"],
    accent: "from-cyan-400 to-blue-500",
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
      "Powerful report generation tool for creating custom reports with history tracking and page management.",
    overview:
      "A powerful report generation tool that enables users to create completely custom reports tailored to their business needs. The system includes page management for multi-page reports, history tracking for all generated reports, and authentication for secure access.",
    categories: ["Analytics"],
    tags: ["Report Generation", "Data Visualization", "Business Intelligence"],
    accent: "from-violet-400 to-purple-500",
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
      "Secure file upload system for managing and organizing documents in your application.",
    overview:
      "A secure and efficient file upload system that enables users to upload, manage, and organize documents within your custom application. The system includes secure authentication and provides a streamlined interface for file management operations.",
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
      "Make sure you know the status of EVERY potential customer and maximize ROI.",
    overview:
      "Make sure you know the status of EVERY potential customer of your system. Ensure that every lead follows the correct pipeline to maximize ROI.",
    categories: ["CRM"],
    tags: ["CRM", "Lead Management", "Sales Pipeline"],
    accent: "from-fuchsia-400 to-pink-500",
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
      "Easily move inventory through your warehouse and track replenishment levels.",
    overview:
      "Easily move inventory through your warehouse and/or place of business. Connect transactions to specific jobs. Track replenishment levels and make purchase orders to suppliers. You can even process returns of unused product at the job level.",
    categories: ["Tracking"],
    tags: ["Inventory Control", "Warehouse Management", "Supply Chain"],
    accent: "from-emerald-400 to-teal-500",
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
      "Track your company vehicles with GPS and generate both current location & path taken within seconds.",
    overview:
      "Track your company vehicles with GPS and generate both current location and path taken within seconds. Run reports to show driver speed throughout the day.",
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
      "Enable your customers to e-sign documents emailed from your Custom Application.",
    overview:
      "Enable your customers to e-sign documents emailed from your Custom Application. Make sure all requirements are met before completion.",
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
      "Integrate with multiple reporting platforms, or create completely custom reporting.",
    overview:
      "Integrate with multiple reporting platforms, or create completely custom reporting. Get granular with your data to find out which regions are most profitable or get a bird's eye view of your numbers.",
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
      "AI Agent system using voice interaction for automated customer service.",
    overview:
      "An AI Agent system utilizing voice recognition and natural language processing technologies to provide automated customer service through voice conversations. The system can understand complex commands and respond naturally, with the ability to learn and improve itself over time.",
    categories: ["AI/ML"],
    tags: ["AI/ML", "Voice Recognition", "Natural Language Processing"],
    accent: "from-rose-400 to-red-500",
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
      "Payment system integrated with QuickBooks for financial transaction management.",
    overview:
      "A payment system designed to integrate directly with QuickBooks, enabling businesses to efficiently manage payments, track transactions, and handle accounting. The system supports multiple payment channels and provides detailed reporting capabilities.",
    categories: ["Payment"],
    tags: ["Payment Integration", "QuickBooks API", "Financial Management"],
    accent: "from-emerald-500 to-teal-600",
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
  subtitle: "Showcasing successful projects across various industries.",
} as const;

export function getPortfolioProject(id: string): PortfolioProject | undefined {
  return portfolioProjects.find((project) => project.id === id);
}
