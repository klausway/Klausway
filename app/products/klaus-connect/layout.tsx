import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/seo";
import { routes } from "@/lib/navigation";

/** Legacy Klaus Connect URL — redirected to WorkNex; keep out of search indexes. */
export const metadata: Metadata = {
  title: "Klaus Connect → WorkNex",
  description:
    "Klaus Connect is now WorkNex. You are being redirected to the WorkNex product page.",
  robots: { index: false, follow: true },
  alternates: {
    canonical: absoluteUrl(`${routes.products}/worknex`),
  },
};

export default function KlausConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
