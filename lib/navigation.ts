export const routes = {
  home: "/",
  about: "/about",
  apps: "/apps",
  products: "/products",
  solutions: "/solutions",
  integrations: "/integrations",
  blog: "/resources",
  resources: "/resources",
  portfolio: "/portfolio",
  contact: "/contact",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
} as const;

/** Public flagship product — all-in-one business platform sold to any company. */
export const klausConnectUrl = "https://www.klaus-connect.com";

/** Branded online ordering for independent restaurants. */
export const apronConnectUrl = "https://www.apronconnect.com/en";

export type RouteKey = keyof typeof routes;

export type NavChild = {
  label: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

export const navItems: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "Services", href: routes.apps },
  { label: "Products", href: routes.products },
  { label: "Solutions", href: routes.solutions },
  { label: "Integrations", href: routes.integrations },
  { label: "Resources", href: routes.resources },
  { label: "About", href: routes.about },
  { label: "Contact", href: routes.contact },
];

export const footerLinks = {
  services: [
    { label: "IT Consulting & Strategy", href: `${routes.apps}#it-consulting` },
    { label: "Apps Built for You", href: `${routes.apps}#custom-apps` },
    { label: "System Integration", href: `${routes.apps}#system-integration` },
    { label: "Smart Automation & AI", href: `${routes.apps}#automation-ai` },
    { label: "Integrations", href: routes.integrations },
  ],
  solutions: [
    { label: "All solutions", href: routes.solutions },
    { label: "Lead pipeline", href: `${routes.solutions}#lead-pipeline` },
    { label: "Customer e-signing", href: `${routes.solutions}#customer-e-signing` },
    { label: "QB Online Payments", href: `${routes.solutions}#quickbooks-payment` },
    { label: "Voice AI agent", href: `${routes.solutions}#voice-ai-agent` },
    { label: "Detailed reporting", href: `${routes.solutions}#detailed-reporting` },
  ],
  company: [
    { label: "Klaus Connect", href: klausConnectUrl },
    { label: "ApronConnect", href: apronConnectUrl },
    { label: "Home", href: routes.home },
    { label: "About Us", href: routes.about },
    { label: "Resources", href: routes.resources },
    { label: "Our Services", href: routes.apps },
    { label: "Products", href: routes.products },
    { label: "Solutions", href: routes.solutions },
    { label: "Contact", href: routes.contact },
  ],
  contact: [
    { label: "support@klausway.com", href: "mailto:support@klausway.com" },
    { label: "(860) 400-0758", href: "tel:+18604000758" },
    {
      label: "North Windham, CT",
      href: "https://maps.google.com/?q=29+Northridge+Drive+North+Windham+CT+06256",
    },
  ],
} as const;
