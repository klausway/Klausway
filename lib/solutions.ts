import type { LucideIcon } from "lucide-react";
import {
  Users,
  CalendarDays,
  Cable,
  Cog,
  Table2,
  BarChart3,
} from "lucide-react";
import {
  portfolioProjects,
  type PortfolioProject,
} from "@/lib/portfolio";

/** Capability / module solutions — distinct from packaged Products. */
export type Solution = PortfolioProject;

export type SolutionOutcome = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

/** Hidden from Solutions (product overlap or removed from this catalog). */
const EXCLUDED_SOLUTION_IDS = new Set([
  "crm",
  "inventory-management",
  "vehicle-tracking",
]);

export const solutionsPageHeader = {
  title: "Solutions",
  subtitle:
    "Built for real business workflows. Tailored to your team — from CRM and scheduling to integrations, automation, and clear dashboards.",
} as const;

/** Outcome grid — “How Klaus Way helps.” */
export const solutionOutcomes: SolutionOutcome[] = [
  {
    id: "customers-jobs",
    title: "Keep customers & jobs organized",
    description:
      "CRM, estimates, job tracking, and customer history in one place.",
    icon: Users,
  },
  {
    id: "scheduling",
    title: "Make scheduling easier",
    description: "Shared calendars, crew assignments, and dispatch tools.",
    icon: CalendarDays,
  },
  {
    id: "integrations",
    title: "Stop entering data twice",
    description:
      "Connect your accounting, email, CRM, and other business tools.",
    icon: Cable,
  },
  {
    id: "automation",
    title: "Automate everyday tasks",
    description:
      "Simplify reminders, follow-ups, approvals, and routine office work.",
    icon: Cog,
  },
  {
    id: "custom-apps",
    title: "Replace messy spreadsheets",
    description:
      "Custom apps built around how your business actually works.",
    icon: Table2,
  },
  {
    id: "dashboards",
    title: "See what needs attention",
    description: "Clear dashboards for sales, expenses, and job progress.",
    icon: BarChart3,
  },
];

export const solutionOutcomesFooter =
  "Built for real business workflows. Tailored to your team.";

/** Capability modules shown on /solutions (detail list). */
export const solutions: Solution[] = portfolioProjects.filter(
  (project) => !EXCLUDED_SOLUTION_IDS.has(project.id),
);

export function getSolution(id: string): Solution | undefined {
  return solutions.find((solution) => solution.id === id);
}
