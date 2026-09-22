import type { LucideIcon } from "lucide-react";
import {
  AtSign,
  Boxes,
  KeyRound,
  Megaphone,
  PhoneCall,
  Receipt,
  Satellite,
} from "lucide-react";

export type Integration = {
  name: string;
  description: string;
  /** Short mark shown when a brand logo isn't available — keep to 1–2 characters. */
  mark: string;
  /** Brand logo in public/integrations. Omit for non-brand entries. */
  logo?: string;
  /** Logo already ships with its own background, so it fills the tile edge to edge. */
  logoFill?: boolean;
  /** Lucide fallback for entries that aren't a third-party brand. */
  icon?: LucideIcon;
};

export type IntegrationGroup = {
  id: string;
  title: string;
  tagline: string;
  icon: LucideIcon;
  accent: string;
  items: Integration[];
};

export const integrationsHeader = {
  eyebrow: "Integrations",
  title: "Works with the tools you already pay for",
  description:
    "Your crews, your bookkeeper, and your suppliers don't want another login. We connect the systems you already run so the data moves on its own — no exports, no double entry.",
} as const;

const accountingPayments: IntegrationGroup = {
  id: "accounting-payments",
  title: "Accounting & Payments",
  tagline: "Money moves once, and lands where finance already works.",
  icon: Receipt,
  accent: "from-emerald-500 to-teal-600",
  items: [
    {
      name: "QuickBooks Online",
      mark: "QB",
      logo: "/integrations/quickbooks.svg",
      description:
        "Send a payment link from the job and see the transaction land in QuickBooks. No re-keying invoices at month end.",
    },
  ],
};

const phoneTextVoice: IntegrationGroup = {
  id: "phone-text-voice",
  title: "Phone, Text & Voice AI",
  tagline: "Every conversation attached to the right customer.",
  icon: PhoneCall,
  accent: "from-sky-500 to-cyan-600",
  items: [
    {
      name: "RingCentral",
      mark: "RC",
      logo: "/integrations/ringcentral.png",
      logoFill: true,
      description:
        "Calls, texts, and recordings attach themselves to the right customer and job automatically.",
    },
    {
      name: "Vapi",
      mark: "VP",
      logo: "/integrations/vapi.svg",
      logoFill: true,
      description:
        "A voice AI agent that answers, qualifies, and logs the conversation into the CRM.",
    },
    {
      name: "Hatch",
      mark: "HA",
      logo: "/integrations/hatch.png",
      logoFill: true,
      description: "Two-way messaging workspaces with contact sync.",
    },
    {
      name: "sent.dm",
      mark: "SD",
      logo: "/integrations/sent-dm.png",
      logoFill: true,
      description:
        "SMS for verification codes and templated updates to homeowners.",
    },
  ],
};

const marketingLeadCapture: IntegrationGroup = {
  id: "marketing-lead-capture",
  title: "Marketing & Lead Capture",
  tagline: "Every campaign lead shows up in the pipeline, not a spreadsheet.",
  icon: Megaphone,
  accent: "from-brand-500 to-indigo-600",
  items: [
    {
      name: "GoHighLevel",
      mark: "GH",
      logo: "/integrations/gohighlevel.png",
      logoFill: true,
      description:
        "Leads from your campaigns enter the pipeline the moment they're created, and leads created in the CRM push back to marketing. Multiple sub-accounts supported, so each branch keeps its own.",
    },
  ],
};

const propertyData: IntegrationGroup = {
  id: "property-data",
  title: "Property Data & Measurement",
  tagline: "Know the property before anyone drives out to it.",
  icon: Satellite,
  accent: "from-violet-500 to-purple-600",
  items: [
    {
      name: "Nearmap",
      mark: "NM",
      logo: "/integrations/nearmap.png",
      logoFill: true,
      description: "Current aerial imagery on every property record.",
    },
    {
      name: "RoofScope",
      mark: "RS",
      logo: "/integrations/roofscope.png",
      description:
        "Order a roof measurement and get the report back inside the job.",
    },
    {
      name: "Artemis Solar",
      mark: "AS",
      logo: "/integrations/artemis-solar.png",
      logoFill: true,
      description:
        "Measurement projects and reports for solar and roofing work.",
    },
    {
      name: "Smarty",
      mark: "SM",
      logo: "/integrations/smarty.png",
      description:
        "Every address validated and enriched with GIS data before it becomes a job.",
    },
    {
      name: "Mapbox",
      mark: "MB",
      logo: "/integrations/mapbox.svg",
      description:
        "Maps, geocoding, and property context across dispatch and address tools.",
    },
  ],
};

const suppliersOrdering: IntegrationGroup = {
  id: "suppliers-ordering",
  title: "Suppliers & Ordering",
  tagline: "Order materials against the job that needs them.",
  icon: Boxes,
  accent: "from-amber-500 to-orange-600",
  items: [
    {
      name: "QXO / Beacon",
      mark: "QX",
      logo: "/integrations/qxo.png",
      logoFill: true,
      description:
        "Browse the supplier catalog, place orders, and track deliveries against the job that needs them.",
    },
  ],
};

/** Ownership group — rendered on the ink band because it is the trust argument. */
export const ownedAccountsGroup: IntegrationGroup = {
  id: "your-accounts",
  title: "Runs on your accounts, not ours",
  tagline:
    "Enterprise buyers always ask the same question: “where does my data live?” It lives with you — under your keys, in your accounts, on your domain.",
  icon: KeyRound,
  accent: "from-signal to-lime-400",
  items: [
    {
      name: "Amazon S3",
      mark: "S3",
      logo: "/integrations/amazon-s3.svg",
      description: "Files and generated documents live in your own bucket.",
    },
    {
      name: "OpenAI",
      mark: "AI",
      logo: "/integrations/openai.svg",
      description:
        "AI features run on your own API key, with your data staying in your account.",
    },
    {
      name: "Your email domain",
      mark: "@",
      icon: AtSign,
      description:
        "Outgoing mail and notifications send from your address, not a vendor's.",
    },
  ],
};

/** Single-integration groups — the home section renders these as a three-up row. */
export const featuredIntegrationGroups: IntegrationGroup[] = [
  accountingPayments,
  marketingLeadCapture,
  suppliersOrdering,
];

/** Multi-integration groups — the home section renders these as two wide list cards. */
export const integrationGroups: IntegrationGroup[] = [
  phoneTextVoice,
  propertyData,
];

/** Every group in narrative order — used by the /integrations page. */
export const allIntegrationGroups: IntegrationGroup[] = [
  accountingPayments,
  phoneTextVoice,
  marketingLeadCapture,
  propertyData,
  suppliersOrdering,
  ownedAccountsGroup,
];

/** Flat list for the logo wall. */
export const allIntegrations: Integration[] = allIntegrationGroups.flatMap(
  (group) => group.items,
);

export const integrationsFooter = {
  title: "Don't see what you use?",
  description:
    "If it has an API, we'll connect it. Building the integration is part of the system we deliver — not a change order six months later.",
  ctaLabel: "Book a 30-minute call",
  microcopy:
    "Integrations are enabled per company. We switch on what you actually use and keep the rest out of your way.",
} as const;

export const integrationsPageHeader = {
  eyebrow: "Integrations",
  title: "Works with the tools you already pay for",
  description:
    "Every connection below ships as part of the system we build for you — enabled per company, running on your own accounts.",
} as const;
