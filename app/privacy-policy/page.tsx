import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { loadLegalDocument } from "@/lib/legal-documents";
import { routes } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Learn how Klaus Way collects, uses, protects, and shares personal information.",
  path: routes.privacyPolicy,
});

export default function PrivacyPolicyPage() {
  const document = loadLegalDocument("klausway-privacy-policy.md");

  return (
    <LegalDocumentPage
      document={document}
      kind="privacy"
      description="How we collect, use, protect, and share information when you visit our site or contact Klaus Way."
    />
  );
}
