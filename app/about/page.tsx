import type { Metadata } from "next";
import { AboutSection } from "@/components/about-section";
import { PageHeader } from "@/components/page-header";
import { CtaSection } from "@/components/cta-section";
import { JsonLd } from "@/components/json-ld";
import { aboutPageHeader } from "@/lib/about";
import { getPublishedTeamMembers } from "@/lib/team-data";
import { routes } from "@/lib/navigation";
import { breadcrumbJsonLd, buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "About",
  description: aboutPageHeader.subtitle,
  path: routes.about,
});

export default async function AboutPage() {
  const teamMembers = await getPublishedTeamMembers();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: routes.home },
          { name: "About", path: routes.about },
        ])}
      />
      <PageHeader
        eyebrow="Klaus Way"
        title={
          <>
            About{" "}
            <span className="text-gradient-animated">Us</span>
          </>
        }
        description={aboutPageHeader.subtitle}
      />
      <AboutSection teamMembers={teamMembers} />
      <CtaSection />
    </>
  );
}
