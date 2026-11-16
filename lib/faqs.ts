import { routes } from "@/lib/navigation";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqGroup = {
  id: string;
  heading: string;
  description?: string;
  items: FaqItem[];
  /** Optional related links shown under the answers. */
  relatedLinks?: { label: string; href: string }[];
};

/** Homepage — company positioning for answer engines and visitors. */
export const homeFaqs: FaqGroup = {
  id: "faq",
  heading: "Common questions",
  description:
    "Short answers about who we are, what we build, and how to get started.",
  items: [
    {
      question: "What does Klaus Way Technology do?",
      answer:
        "Klaus Way (also called Klaus Way Technology) builds purpose-built software for how businesses actually work. We design and run packaged products such as WorkNex and ApronConnect, and we provide IT consulting, custom applications, system integration, automation, data analytics, and cloud services.",
    },
    {
      question: "Who is Klaus Way for?",
      answer:
        "We work with companies that sell and deliver work — including home services, contracting, field teams, restaurants, and other operators who need clearer workflows than one-size-fits-all tools allow. Clients can start with a packaged product or a custom engagement.",
    },
    {
      question: "How do I request a demo or free consultation?",
      answer:
        "Use the Contact page to request a free consultation or a product demo. You can also call (860) 400-0758 or email support@klausway.com. We reply within one business day.",
    },
  ],
  relatedLinks: [
    { label: "Contact us", href: routes.contact },
    { label: "Our products", href: routes.products },
    { label: "Our services", href: routes.apps },
  ],
};

/** About page — company identity. */
export const aboutFaqs: FaqGroup = {
  id: "faq",
  heading: "About Klaus Way",
  description: "How the company started and what we focus on today.",
  items: [
    {
      question: "What is Klaus Way Technology?",
      answer:
        "Klaus Way Technology is the company behind Klaus Way. Founded in 2019 by Klaus Larsen and Ravee “Jim” Tansangworn, it builds software and IT services that help businesses organize customers, jobs, scheduling, and operations.",
    },
    {
      question: "What problems does Klaus Way help solve?",
      answer:
        "We help teams replace disconnected tools and outdated systems with clearer workflows — from CRM and quoting to scheduling, integrations, automation, reporting, and cloud infrastructure — so less time is spent fighting technology.",
    },
    {
      question: "Where is Klaus Way located?",
      answer:
        "Klaus Way is based in North Windham, Connecticut, at 29 Northridge Drive. Business hours are Monday–Friday, 9:00 AM–4:00 PM EST.",
    },
  ],
  relatedLinks: [
    { label: "Meet the team", href: `${routes.about}#team` },
    { label: "Book a free consult", href: routes.contact },
  ],
};

/** Products index — product catalog questions. */
export const productsFaqs: FaqGroup = {
  id: "faq",
  heading: "Product questions",
  description: "How our packaged software fits common business needs.",
  items: [
    {
      question:
        "What kind of CRM software is available for roofing and home improvement companies?",
      answer:
        "WorkNex is Klaus Way’s flagship all-in-one platform for CRM, quotes, jobs, scheduling, inventory, and teams. It grew from systems built for roofing and home-improvement operations and is available as a public product at klaus-connect.com.",
    },
    {
      question: "What is WorkNex, and who is it designed for?",
      answer:
        "WorkNex is Klaus Way’s flagship all-in-one platform for companies that sell and deliver work — especially home services, contracting, and field teams. It brings CRM, quotes, jobs, scheduling, inventory, and teams into one system.",
    },
    {
      question: "What other products does Klaus Way offer?",
      answer:
        "Alongside WorkNex, Klaus Way offers ApronConnect for restaurant online ordering, plus Dispatcher, DineAssist, SpendLedger, and CompliCo. Each product page explains who it serves and how to request a demo.",
    },
  ],
  relatedLinks: [
    { label: "WorkNex", href: `${routes.products}/worknex` },
    { label: "All products", href: routes.products },
    { label: "Request a demo", href: `${routes.contact}?intent=demo` },
  ],
};

/** WorkNex detail page. */
export const worknexFaqs: FaqGroup = {
  id: "faq",
  heading: "About WorkNex",
  description: "What the flagship product does and who it is for.",
  items: [
    {
      question: "What is WorkNex?",
      answer:
        "WorkNex is Klaus Way’s flagship all-in-one business platform. It brings CRM, quotes, jobs, scheduling, inventory, and teams into one operating system so sales, production, and finance work from the same customer record.",
    },
    {
      question: "Who is WorkNex designed for?",
      answer:
        "It is designed for companies that sell and deliver work — including home services, contracting, and field teams — especially operators consolidating separate CRM, scheduling, and invoicing tools or running multi-location operations.",
    },
    {
      question:
        "How can a contractor manage leads, estimates, scheduling, and production in one system?",
      answer:
        "WorkNex keeps one record from first lead through quote, job, schedule, and payment. Teams use CRM and pipeline tools, online quotes with e-signature, crew calendars, inventory, and live dashboards in the same platform. Feature tours and trial signup are on klaus-connect.com.",
    },
  ],
  relatedLinks: [
    { label: "Visit WorkNex", href: "https://www.klaus-connect.com" },
    {
      label: "Book a WorkNex demo",
      href: `${routes.contact}?product=worknex&intent=demo`,
    },
    { label: "See other products", href: routes.products },
  ],
};

/** Services (/apps) — custom work and consulting. */
export const servicesFaqs: FaqGroup = {
  id: "faq",
  heading: "Services questions",
  description: "When to engage Klaus Way for consulting or custom software.",
  items: [
    {
      question: "Can Klaus Way Technology build custom software for a business?",
      answer:
        "Yes. Custom application development is a core service — web and mobile apps tailored to your workflows, with scalable architecture and user-focused design. Many projects also include system integration, automation, analytics, or cloud work.",
    },
    {
      question: "What IT services does Klaus Way provide?",
      answer:
        "Services include IT consulting and strategy, custom apps, system integration and APIs, smart automation and AI, data and analytics, and cloud migration and operations.",
    },
    {
      question: "How do I start a project?",
      answer:
        "Book a free consultation on the Contact page and describe the problem you need solved. The same team that designs and ships the software will help map the simplest path — no obligation for the consult.",
    },
  ],
  relatedLinks: [
    { label: "Book a free consult", href: routes.contact },
    { label: "Browse solutions", href: routes.solutions },
    { label: "See products", href: routes.products },
  ],
};

/** Solutions page — workflow outcomes. */
export const solutionsFaqs: FaqGroup = {
  id: "faq",
  heading: "Solutions questions",
  description: "How we approach real business workflows.",
  items: [
    {
      question:
        "How can a contractor manage leads, estimates, scheduling, and production more clearly?",
      answer:
        "Klaus Way builds solutions that keep customers and jobs organized, simplify scheduling and dispatch, connect existing tools, automate repetitive steps, and surface clear reporting. For a packaged all-in-one option, see WorkNex; for tailored modules, start with a free consultation.",
    },
    {
      question: "What is the difference between Products and Solutions?",
      answer:
        "Products are packaged platforms Klaus Way designs and runs — such as WorkNex and ApronConnect. Solutions are workflow capabilities we implement for your team, from lead pipelines and e-signing to reporting, payments, and voice AI agents.",
    },
    {
      question: "Do you integrate with tools we already use?",
      answer:
        "Yes. System integration is a core service, and the Integrations page lists connection categories we work with — including accounting, communications, maps, payments, marketing, and AI/voice tools. Integrations typically ship as part of the system we build.",
    },
  ],
  relatedLinks: [
    { label: "View integrations", href: routes.integrations },
    { label: "WorkNex", href: `${routes.products}/worknex` },
    { label: "Get a free consult", href: routes.contact },
  ],
};
