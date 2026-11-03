import {
  apronConnectUrl,
  klausConnectUrl,
  routes,
  type NavChild,
} from "@/lib/navigation";

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
  /** Canonical public product site. When set, CTAs link out instead of staying on klausway.com. */
  productUrl?: string;
};

export const productsPageHeader = {
  title: "Our Products",
  subtitle:
    "Real, working software we design, build, and run — led by Klaus Connect, our all-in-one business platform, plus ApronConnect for restaurants, AI assistants, dispatch, payments, and more.",
} as const;

export const featuredProducts: FeaturedProduct[] = [
  {
    id: "klaus-connect",
    name: "Klaus Connect",
    tagline: "Sell, deliver, and decide in one system",
    productUrl: klausConnectUrl,
    description:
      "Klaus Connect is the public all-in-one business platform from Klaus Way — CRM, quotes, jobs, scheduling, inventory, and teams in one operating system, so nothing slips between tools. Start a free trial or book a demo on klaus-connect.com.",
    features: [
      "CRM, pipeline, and quotes with full customer history",
      "Jobs, crew calendars, routes, and inventory in one flow",
      "Online quotes, contracts, and e-signature",
      "Live dashboards and reports by branch and period",
    ],
    tags: ["CRM", "Operations", "Field service"],
    image: "/products/klaus-connect-hero.png",
    imageAlt: "Klaus Connect company scoreboard with live pipeline and revenue",
    accent: "from-blue-400 to-indigo-400",
    overview:
      "Klaus Connect is Klaus Way’s flagship product for any company that sells and delivers work. It started from the systems we built for field-service operators, then became a public platform: one record from first lead through quote, job, schedule, and payment. Feature tours, live demos, and trial signup live on the Klaus Connect site.",
    benefits: [
      "One customer record from first call through final payment",
      "Sales, production, and finance stop re-keying the same job",
      "Leaders see live pipeline and revenue pacing against goal",
      "Crews get a calendar; customers get a quote they can sign online",
    ],
    useCases: [
      "Home services, contracting, and field teams running multi-crew operations",
      "Companies replacing separate CRM, scheduling, and invoicing tools",
      "Teams that need sales and production working from one system",
      "Multi-location operators consolidating reporting",
    ],
    tour: [
      {
        image: "/products/klaus-connect-hero.png",
        title: "Company scoreboard",
        caption:
          "Filter by location, then week → month → quarter — leads, appointments, jobs, sold, and installed, each measured against goal.",
      },
      {
        image: "/products/klaus-connect-quotes.png",
        title: "Quotes and e-sign",
        caption:
          "Build a quote, open Sign in App, and let the customer draw and submit — the same path your team uses every day.",
      },
      {
        image: "/products/worknex-3.png",
        title: "Production calendar",
        caption:
          "Scheduled work across crews and departments, colour-coded by service type so operations can see capacity at a glance.",
      },
    ],
  },
  {
    id: "apronconnect",
    name: "ApronConnect",
    tagline: "Your menu. Ready to order.",
    productUrl: apronConnectUrl,
    description:
      "A branded online storefront for independent restaurants — guests order in a few taps, you keep the relationship, and there is 0% marketplace cut. Pick a theme, publish the menu, and take pickup orders the same night.",
    features: [
      "Branded storefront that feels like the dining room, not a marketplace",
      "Menu, modifiers, and prices the kitchen actually uses",
      "Built-in themes — type, color, and plating change; checkout stays familiar",
      "Pickup orders with 0% marketplace commission",
    ],
    tags: ["Restaurants", "Online ordering", "Storefront"],
    image: "/products/apronconnect.png",
    imageAlt: "ApronConnect branded restaurant storefront and menu",
    accent: "from-sky-400 to-orange-400",
    overview:
      "ApronConnect puts the dining room in the guest’s pocket. Hungry visitors land on a page that looks like the restaurant, tap a dish they recognize, and check out without creating an account they don’t want. Owners update specials in minutes, keep every guest on their own list, and never pay a marketplace tax on the order. Starter is free forever; Growth and Pro add full site control, themes, and a custom domain.",
    benefits: [
      "Guests order from your brand — not a crowded third-party marketplace",
      "Menu updates take minutes, not a designer and a deploy",
      "You keep the customer relationship and 0% marketplace cut",
      "Themes match the room: smokehouse, café, fine dining, and more",
    ],
    useCases: [
      "Independent restaurants that want their own branded ordering page",
      "Kitchens tired of marketplace fees and generic storefronts",
      "Owners who need to change specials without calling a developer",
      "Groups that want one ordering flow across several looks",
    ],
    tour: [
      {
        image: "/products/apronconnect.png",
        title: "Branded storefront",
        caption:
          "Hero, hours, and the dishes they came for — a page that feels like the dining room, then a fast path from craving to pickup.",
      },
      {
        image: "/products/apronconnect-2.png",
        title: "Live menu — TeeJay's Smokehouse",
        caption:
          "Warm, candlelit theme: guests land on the restaurant’s voice, tap a plate, and order without a marketplace account.",
      },
      {
        image: "/products/apronconnect-3.png",
        title: "Live menu — Verdura Kitchen",
        caption:
          "Bright, airy theme: same ordering flow, different room — type, color, and plating change to match the kitchen.",
      },
    ],
  },
  {
    id: "dispatcher",
    name: "Dispatcher",
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
    imageAlt: "Dispatcher scheduling board",
    accent: "from-teal-400 to-emerald-400",
    overview:
      "Dispatcher is the scheduling board dispatchers actually live in. Every employee gets a row on a timeline; every job is a block you can drag to reschedule, stretch to re-time, or draw from scratch. Filters narrow the board by department, crew, service type, or search, and a map view puts the same day's work in geographic context so you can route sensibly. Role-based permissions decide who can move what, and cancellations are soft, never destructive.",
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
    accent: "from-sky-400 to-cyan-400",
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
];

export function getFeaturedProduct(id: string): FeaturedProduct | undefined {
  return featuredProducts.find((product) => product.id === id);
}

/** Navbar Products dropdown — always in-site product pages. */
export function getProductNavChildren(): NavChild[] {
  return [
    { label: "All products", href: routes.products },
    ...featuredProducts.map((product) => ({
      label: product.name,
      href: `${routes.products}/${product.id}`,
    })),
  ];
}
