import {
  portfolioProjects,
  type PortfolioProject,
} from "@/lib/portfolio";

/** Capability / module solutions — distinct from packaged Products. */
export type Solution = PortfolioProject;

/** Hidden from Solutions (product overlap or removed from this catalog). */
const EXCLUDED_SOLUTION_IDS = new Set([
  "crm",
  "inventory-management",
  "vehicle-tracking",
]);

export const solutionsPageHeader = {
  title: "Solutions",
  subtitle:
    "Capabilities we design and ship inside real operations — pipelines, reporting, payments, e-sign, and the day-to-day pieces that make software actually work.",
} as const;

/** Solutions shown on /solutions and the home Solutions block. */
export const solutions: Solution[] = portfolioProjects.filter(
  (project) => !EXCLUDED_SOLUTION_IDS.has(project.id),
);

export function getSolution(id: string): Solution | undefined {
  return solutions.find((solution) => solution.id === id);
}
