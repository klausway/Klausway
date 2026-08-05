/** One step in a product's guided screenshot tour. */
export type ProductTourStep = {
  image: string;
  title: string;
  caption: string;
};

export type FeaturedProduct = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  tags: string[];
  image: string;
  imageAlt: string;
  accent: string;
  /** Longer narrative shown on the detail page. */
  overview: string;
  benefits: string[];
  useCases: string[];
  /** Guided walkthrough; the first step doubles as the detail-page hero. */
  tour: ProductTourStep[];
  /** Live, publicly reachable demo. Leave unset to show the "Request a demo" CTA. */
  demoUrl?: string;
};

export const productsPageHeader = {
  title: "Our Products",
  subtitle:
    "Real, working software we design, build, and run — from AI-powered assistants to full-cycle business platforms.",
} as const;

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "klaus-connect",
    name: "Klaus Connect",
    tagline: "Full-cycle CRM — from lead to payment in one platform",
    description:
      "A complete business operations suite that connects sales, operations, and finance. Klaus Connect covers the entire customer lifecycle: lead capture, dynamic quoting, project delivery, scheduling, reporting, and integrated payments — with a customer portal, admin console, and mobile app built around the same core.",
    features: [
      "Lead capture, estimates, and dynamic quoting",
      "Project delivery, milestone tracking, and dispatcher scheduling",
      "Back-office admin console with real-time reports",
      "Customer portal, e-signing, and mobile companion app",
    ],
    tags: ["CRM", "Suite", "Operations"],
    image: "/products/klaus-connect.png",
    imageAlt: "Klaus Connect CRM dashboard",
    accent: "from-blue-400 to-cyan-400",
    overview:
      "Klaus Connect replaces the patchwork of spreadsheets, calendars, and disconnected tools that most service businesses run on. Sales works leads and builds estimates, operations schedules and delivers the job, and finance invoices and collects — all against the same records, so nobody re-keys data and nothing falls through the cracks. It ships with a customer portal, a back-office admin console, real-time reporting, and a mobile app for crews in the field.",
    benefits: [
      "One record per customer from first call through final payment",
      "No re-keying between sales, operations, and accounting",
      "Managers see live pipeline and revenue pacing against goal",
      "Crews and customers get their own tailored views",
    ],
    useCases: [
      "Home services and contracting businesses running multi-crew operations",
      "Companies replacing separate CRM, scheduling, and invoicing tools",
      "Teams that need sales and production working from one system",
      "Multi-location operators consolidating reporting",
    ],
    tour: [
      {
        image: "/products/klaus-connect.png",
        title: "Company dashboard",
        caption:
          "Live pipeline and revenue pacing — leads, appointments set, jobs run, sold, and installed, each measured against goal with week-over-week trend.",
      },
      {
        image: "/products/klaus-connect-2.png",
        title: "Estimates pipeline",
        caption:
          "Every estimate in one filterable list with status, job type, location, and value, so nothing sits idle in the funnel.",
      },
      {
        image: "/products/klaus-connect-3.png",
        title: "Production calendar",
        caption:
          "Scheduled work across crews and departments, colour-coded by service type so operations can see capacity at a glance.",
      },
    ],
  },
  {
    id: "dispatcher",
    name: "Klaus Dispatcher",
    tagline: "A live scheduling board for who's doing what, when",
    description:
      "A dispatcher and manager scheduling board that shows your whole team's day at a glance. Jobs are grouped by employee on a timeline you can drag to reschedule, resize to adjust, and drag-create right on the board — with role-based permissions deciding who can change what.",
    features: [
      "Timeline grouped by employee, with day, week, month, and agenda views",
      "Drag to reschedule, resize to adjust, drag-create new jobs",
      "Filter by team, employee, department, job type, or search",
      "Shareable deep links and colored legends for every calendar type",
    ],
    tags: ["Scheduling", "Dispatch", "Operations"],
    image: "/products/dispatcher.png",
    imageAlt: "Klaus Dispatcher scheduling board",
    accent: "from-teal-400 to-emerald-400",
    overview:
      "Klaus Dispatcher is the scheduling board dispatchers actually live in. Every employee gets a row on a timeline; every job is a block you can drag to reschedule, stretch to re-time, or draw from scratch. Filters narrow the board by department, crew, service type, or search, and a map view puts the same day's work in geographic context so you can route sensibly. Role-based permissions decide who can move what, and cancellations are soft, never destructive.",
    benefits: [
      "Reschedule by dragging — no forms, no page reloads",
      "See the entire crew's capacity in one screen",
      "Map view exposes routing and travel-time problems early",
      "Shareable deep links put everyone on the same view",
    ],
    useCases: [
      "Dispatchers assigning daily field work across crews",
      "Operations managers balancing workload between departments",
      "Service businesses coordinating installs and repairs",
      "Teams that need to see schedule and geography together",
    ],
    tour: [
      {
        image: "/products/dispatcher.png",
        title: "Month board",
        caption:
          "The full month across every crew, colour-coded by service type, with department filters and a legend for reading the board at a glance.",
      },
      {
        image: "/products/dispatcher-2.png",
        title: "Week timeline",
        caption:
          "Hour-by-hour detail for the current week — the working view for assigning and re-timing jobs.",
      },
      {
        image: "/products/dispatcher-3.png",
        title: "Route map",
        caption:
          "Every scheduled job plotted geographically so dispatchers can group nearby work and cut windshield time.",
      },
    ],
  },
  {
    id: "dineassist",
    name: "DineAssist",
    tagline: "AI calling CRM built for restaurants",
    description:
      "DineAssist answers your restaurant's phone with an AI voice agent that takes reservations and orders around the clock, then hands everything to a purpose-built CRM. Staff manage customers, menus, orders, and reservations from one dashboard, with every call logged and analyzed.",
    features: [
      "AI voice agent answers calls, reservations, and orders 24/7",
      "Orders, reservations, and menu management in one place",
      "Customer profiles with full call and visit history",
      "Call logs, notifications, and performance analytics",
    ],
    tags: ["AI Voice", "CRM", "Restaurants"],
    image: "/products/dineassist.png",
    imageAlt: "DineAssist restaurant dashboard",
    accent: "from-amber-400 to-orange-400",
    overview:
      "DineAssist answers the phone when your staff can't. An AI voice agent takes reservations and orders around the clock, confirms details with the caller, and writes everything straight into a restaurant CRM — no separate order pad, no missed calls at the dinner rush. Staff manage menus, orders, reservations, and customers from one dashboard, with every call recorded, transcribed, and attached to the customer's history.",
    benefits: [
      "Never miss a booking because the line was busy",
      "Orders and reservations land in the system already structured",
      "Full call history attached to every customer record",
      "Staff run the floor instead of the phone",
    ],
    useCases: [
      "Restaurants losing reservations to unanswered calls",
      "Multi-location groups standardising phone handling",
      "Takeout-heavy kitchens managing high order volume",
      "Owners who want call analytics and customer insight",
    ],
    tour: [
      {
        image: "/products/dineassist.png",
        title: "Order board",
        caption:
          "Live orders moving through confirmed, preparing, ready, out for delivery, and completed — with order creation built into the same screen.",
      },
      {
        image: "/products/dineassist-2.png",
        title: "Customer directory",
        caption:
          "Every caller becomes a customer record with contact details, tags, and visit history the AI agent can draw on.",
      },
      {
        image: "/products/dineassist-3.png",
        title: "Reservations",
        caption:
          "Availability checking and the full reservation list, with party size, time, and status for the whole service.",
      },
    ],
  },
  {
    id: "klr-ai",
    name: "KLR AI",
    tagline: "Ask your operational database anything, in plain English",
    description:
      "A manager-facing AI chat interface that turns natural-language questions into safe, read-only queries against a live operational PostgreSQL database. Instead of waiting on reports, managers ask questions and get instant, accurate answers backed by real data.",
    features: [
      "Natural-language chat over live operational data",
      "Read-only, guarded access to the production database",
      "Semantic mappings tuned to your business vocabulary",
      "Instant answers without building reports or dashboards",
    ],
    tags: ["AI", "Analytics", "PostgreSQL"],
    image: "/products/klr-ai.png",
    imageAlt: "KLR AI chat interface",
    accent: "from-violet-400 to-purple-400",
    overview:
      "KLR AI puts a chat box in front of your operational database. Managers ask questions in plain English — \"how many jobs did we run last week?\", \"what's outstanding in Hartford?\" — and get answers computed from live data instead of waiting on someone to build a report. Every query is translated to read-only SQL and guarded, so the system can answer anything but change nothing. An admin console tunes the semantic mappings so the AI speaks your business's vocabulary.",
    benefits: [
      "Answers in seconds instead of report-building backlogs",
      "Read-only by construction — the AI can never modify data",
      "Semantic mappings teach it your terminology",
      "Exports to PDF and Excel for sharing upward",
    ],
    useCases: [
      "Managers who need numbers without waiting on analysts",
      "Executives asking ad-hoc questions between meetings",
      "Teams whose reporting needs change faster than dashboards",
      "Companies with rich operational data and no BI team",
    ],
    tour: [
      {
        image: "/products/klr-ai.png",
        title: "Chat interface",
        caption:
          "Ask a question in plain English; the assistant queries live operational data and returns the answer, with the conversation saved for reuse.",
      },
      {
        image: "/products/klr-ai-2.png",
        title: "Search landing",
        caption:
          "A focused entry point — type a question about company data and go, no dashboard navigation required.",
      },
      {
        image: "/products/klr-ai-3.png",
        title: "Admin and training",
        caption:
          "Configure the LLM provider, monitor usage and cost, and tune semantic field mappings so answers match your business vocabulary.",
      },
    ],
  },
  {
    id: "spendledger",
    name: "SpendLedger",
    tagline: "Enterprise expense management, end to end",
    description:
      "SpendLedger gives finance teams full control over company spending: employees capture receipts and submit expenses, managers approve on the go, and finance reconciles against live bank feeds — with analytics and monthly reports that keep every dollar accounted for.",
    features: [
      "Receipt capture and expense submission workflows",
      "Bank transaction sync and reconciliation",
      "Role-based approvals for employees, managers, and admins",
      "Spending analytics and automated monthly reports",
    ],
    tags: ["Finance", "Expenses", "Analytics"],
    image: "/products/spendledger.png",
    imageAlt: "SpendLedger expense analytics dashboard",
    accent: "from-lime-400 to-green-400",
    overview:
      "SpendLedger closes the loop between a swipe and a reconciled book entry. Card charges sync automatically from the bank, employees attach receipts and categorise from their phone, managers approve, and finance reconciles — with the system flagging anything missing a receipt. An auto-categorisation engine learns your patterns so most transactions arrive pre-coded, and monthly reporting shows exactly where the money went.",
    benefits: [
      "Every charge tracked from swipe to reconciled entry",
      "Missing receipts flagged automatically, not at month end",
      "Auto-categorisation learns and pre-codes transactions",
      "Role-based approvals for employees, managers, and admins",
    ],
    useCases: [
      "Finance teams chasing receipts across a card programme",
      "Companies replacing spreadsheet-based expense reporting",
      "Businesses needing clean categorised books each month",
      "Operations with field staff spending on company cards",
    ],
    tour: [
      {
        image: "/products/spendledger.png",
        title: "My transactions",
        caption:
          "Every card charge with merchant, category, and receipt status — missing receipts flagged in red so nothing reaches month-end incomplete.",
      },
      {
        image: "/products/spendledger-2.png",
        title: "Role-based workflows",
        caption:
          "Built-in guidance for each access level, from employees submitting expenses through to managers approving and admins reconciling.",
      },
    ],
  },
  {
    id: "complico",
    name: "CompliCo",
    tagline: "Compliance tracking with a live expiration dashboard",
    description:
      "CompliCo keeps small businesses audit-ready by tracking company, employee, and vehicle compliance records in one place. A live dashboard surfaces upcoming expirations before they become violations, while AI-assisted document extraction takes the data entry out of staying compliant.",
    features: [
      "Company, employee, and vehicle compliance records",
      "Live dashboard of upcoming and overdue expirations",
      "AI-assisted document upload and data extraction",
      "Multi-tenant with notifications and reminders",
    ],
    tags: ["Compliance", "Dashboards", "AI"],
    image: "/products/complico.png",
    imageAlt: "CompliCo compliance dashboard",
    accent: "from-fuchsia-400 to-pink-400",
    overview:
      "CompliCo keeps a business audit-ready without anyone maintaining a spreadsheet of expiry dates. It tracks compliance records across companies, employees, vehicles, and subcontractors, and surfaces a live dashboard of what has expired, what is due in thirty days, and what is due in ninety. Documents can be uploaded and read automatically — AI extraction pulls the issue and expiry dates off the certificate — and an advisor flags requirement gaps against the regulations that apply to you.",
    benefits: [
      "Expirations surface before they become violations",
      "AI extraction removes the data entry from compliance",
      "One system for company, employee, vehicle, and sub records",
      "Advisor identifies requirement gaps you didn't know you had",
    ],
    useCases: [
      "Contractors managing licences, insurance, and DOT records",
      "Fleet operators tracking registrations and inspections",
      "Companies preparing for audits or insurance renewals",
      "Businesses onboarding subcontractors with document requirements",
    ],
    tour: [
      {
        image: "/products/complico.png",
        title: "Compliance dashboard",
        caption:
          "Expired, due-in-30, due-in-90, and current counts up front, with upcoming renewals ranked by urgency and an AI advisor flagging requirement gaps.",
      },
      {
        image: "/products/complico-2.png",
        title: "Vehicle records",
        caption:
          "Registrations, inspections, and insurance tracked per vehicle across the fleet.",
      },
      {
        image: "/products/complico-3.png",
        title: "Document library",
        caption:
          "Uploaded certificates with AI-extracted dates, linked back to the company, employee, or vehicle they cover.",
      },
    ],
  },
  {
    id: "qb-payments",
    name: "QB Online Payments",
    tagline: "Payment links your customers can pay in one click",
    description:
      "A payment platform that lets admins generate secure payment links and process card payments through QuickBooks. Customers pay from a clean, branded page — no account needed — while the admin dashboard tracks links, payments, and reports in real time.",
    features: [
      "Admin-generated secure payment links",
      "Card processing through QuickBooks Online",
      "Branded, no-login customer payment pages",
      "Payment tracking, reports, and reconciliation",
    ],
    tags: ["Payments", "QuickBooks", "Finance"],
    image: "/products/qb-payments.png",
    imageAlt: "QB Online Payments admin dashboard",
    accent: "from-sky-400 to-indigo-400",
    overview:
      "QB Online Payments turns getting paid into a link. An admin generates a secure payment link for a customer, the customer opens a clean branded page and pays by card without creating an account, and the payment posts straight into QuickBooks Online. The admin side tracks every link and payment in real time, with a full event log showing exactly what happened to each transaction and financial reports built from the reconciled data.",
    benefits: [
      "Customers pay in one click, no account required",
      "Payments post directly into QuickBooks Online",
      "Full event log for every payment attempt",
      "Real-time visibility into what's paid, active, and pending",
    ],
    useCases: [
      "Businesses invoicing customers who want to pay by card",
      "Companies already running accounting in QuickBooks Online",
      "Teams needing an audit trail for every payment",
      "Service businesses collecting deposits and final payments",
    ],
    tour: [
      {
        image: "/products/qb-payments.png",
        title: "Payments dashboard",
        caption:
          "Total links, paid, active, and pending at a glance, with a live feed of recent payment events as they happen.",
      },
      {
        image: "/products/qb-payments-2.png",
        title: "Journal entries",
        caption:
          "Accounting entries generated from payments, ready to reconcile against QuickBooks.",
      },
      {
        image: "/products/qb-payments-3.png",
        title: "Financial reports",
        caption:
          "Profit and loss and balance sheet views built from the reconciled payment data.",
      },
      {
        image: "/products/qb-payments-4.png",
        title: "Payment event log",
        caption:
          "Every step of every transaction — token validation, processing, confirmation emails — for complete auditability.",
      },
    ],
  },
];

export function getFeaturedProduct(id: string): FeaturedProduct | undefined {
  return featuredProducts.find((product) => product.id === id);
}
