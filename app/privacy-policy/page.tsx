import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { loadLegalDocument } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Klaus Way collects, uses, protects, and shares personal information.",
};

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
