import type { Metadata } from "next";
import { LegalDocumentPage } from "@/components/legal-document-page";
import { loadLegalDocument } from "@/lib/legal-documents";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Review the terms governing access to and use of the Klaus Way website.",
};

export default function TermsOfServicePage() {
  const document = loadLegalDocument("klausway-terms-of-service.md");

  return (
    <LegalDocumentPage
      document={document}
      kind="terms"
      description="The terms that govern access to and use of the Klaus Way website and its content."
    />
  );
}
