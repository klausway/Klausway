import type { ComponentType } from "react";
import { AnalyticsVisual } from "./feature-visuals/analytics-visual";
import { FileUploadVisual } from "./feature-visuals/file-upload-visual";
import { EsignVisual } from "./feature-visuals/esign-visual";
import { TrackingVisual } from "./feature-visuals/tracking-visual";
import { ReportGeneratorVisual } from "./feature-visuals/report-generator-visual";
import { DetailedReportingVisual } from "./feature-visuals/detailed-reporting-visual";

export type PortfolioScreenshot = {
  src: string;
  url: string;
  alt: string;
};

/** Real product screenshots where a portfolio project maps to shipped software. */
export const portfolioImageMap: Record<string, PortfolioScreenshot> = {
  crm: {
    src: "/products/klaus-connect.png",
    url: "Klaus Connect — CRM",
    alt: "Klaus Connect CRM dashboard",
  },
  "lead-pipeline": {
    src: "/products/klaus-connect-2.png",
    url: "Klaus Connect — Pipeline",
    alt: "Klaus Connect lead pipeline view",
  },
  "quickbooks-payment": {
    src: "/products/qb-payments.png",
    url: "QB Online Payments",
    alt: "QuickBooks online payment links",
  },
  "voice-ai-agent": {
    src: "/products/klr-ai.png",
    url: "KLR AI — Voice Agent",
    alt: "Voice AI agent conversation dashboard",
  },
  "inventory-management": {
    src: "/products/dispatcher.png",
    url: "Operations — Inventory",
    alt: "Inventory and dispatch operations board",
  },
};

/** Hand-built visuals for projects without product screenshots. */
export const portfolioVisualMap: Record<string, ComponentType> = {
  "upload-file": FileUploadVisual,
  "customer-e-signing": EsignVisual,
  "vehicle-tracking": TrackingVisual,
  "report-generator": ReportGeneratorVisual,
  "detailed-reporting": DetailedReportingVisual,
};

export function getPortfolioScreenshot(
  projectId: string,
): PortfolioScreenshot | undefined {
  return portfolioImageMap[projectId];
}

export function getPortfolioVisual(projectId: string): ComponentType {
  return portfolioVisualMap[projectId] ?? AnalyticsVisual;
}
