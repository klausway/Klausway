export const routes = {
  home: "/",
  about: "/about",
  apps: "/apps",
  products: "/products",
  blog: "/resources",
  resources: "/resources",
  pricing: "/pricing",
  portfolio: "/portfolio",
  contact: "/contact",
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
} as const;

export type RouteKey = keyof typeof routes;

export const navItems = [
  { label: "Home", href: routes.home },
  { label: "About", href: routes.about },
  { label: "Services", href: routes.apps },
  { label: "Products", href: routes.products },
  { label: "Resources", href: routes.resources },
  { label: "Portfolio", href: routes.portfolio },
  { label: "Contact", href: routes.contact },
] as const;

export const footerLinks = {
  services: [
    { label: "IT Consulting & Strategy", href: `${routes.apps}#it-consulting` },
    { label: "Apps Built for You", href: `${routes.apps}#custom-apps` },
    { label: "System Integration", href: `${routes.apps}#system-integration` },
    { label: "Smart Automation & AI", href: `${routes.apps}#automation-ai` },
  ],
  solutions: [
    { label: "Data & Analytics", href: `${routes.apps}#data-analytics` },
    { label: "Cloud Services", href: `${routes.apps}#cloud-services` },
    { label: "CRM", href: `${routes.apps}#custom-apps` },
    { label: "Voice AI Agent", href: `${routes.apps}#automation-ai` },
  ],
  company: [
    { label: "Home", href: routes.home },
    { label: "About Us", href: routes.about },
    { label: "Resources", href: routes.resources },
    { label: "Our Services", href: routes.apps },
    { label: "Products", href: routes.products },
    { label: "Portfolio", href: routes.portfolio },
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
