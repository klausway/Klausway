import type { Metadata } from "next";
import { CmsDashboard } from "@/components/admin/cms-dashboard";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Admin",
  description: "Klaus Way content management system.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return <CmsDashboard />;
}
