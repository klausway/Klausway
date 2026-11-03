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
        eyebrow="About Klaus Way"
        title={
          <>
            <span className="block">We build.</span>
            <span className="block">We connect.</span>
            <span className="block text-brand-600">We simplify.</span>
          </>
        }
        description={aboutPageHeader.subtitle}
      />
      <AboutSection teamMembers={teamMembers} />
      <CtaSection
        heading={
          <>
            Meet the team{" "}
            <span className="underline-signal">on a call</span>
          </>
        }
        subheading="The people you talk to are the same people who design, build, and run your system. No handoffs, no account managers."
        primaryLabel="Book a free consult"
        location="cta_section:about"
      />
    </>
  );
}
