import type { Metadata } from "next";
import { LeadsDashboard } from "@/components/admin/leads-dashboard";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Leads",
  description: "Contact form leads.",
  path: "/admin/leads",
  noIndex: true,
});

export default function AdminLeadsPage() {
  return <LeadsDashboard />;
}
