import { Reveal } from "./animation/reveal";
import { TeamGrid } from "./team-grid";
import { TrackedLink } from "./tracked-link";
import {
  ourStory,
  values,
  type TeamMember,
} from "@/lib/about";
import { brand } from "@/lib/brand";
import { klausConnectUrl } from "@/lib/navigation";
import { assetPath } from "@/lib/asset-path";

type AboutSectionProps = {
  teamMembers: TeamMember[];
};

export function AboutSection({ teamMembers }: AboutSectionProps) {
  return (
    <>
      <section id="story" className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-start gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {ourStory.title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                {ourStory.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
              <TrackedLink
                href={klausConnectUrl}
                external
                target="_blank"
                rel="noopener noreferrer"
                event="cta_click"
                eventParams={{ location: "about_story", product: "klaus_connect" }}
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                Visit Klaus Connect →
              </TrackedLink>
            </Reveal>

            <Reveal delay={100} className="lg:sticky lg:top-28 lg:mt-14">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <video
                  className="h-full w-full object-cover"
                  src={assetPath("/videos/our-story.mp4")}
                  poster={assetPath("/videos/our-story-poster.jpg")}
                  controls
                  playsInline
                  preload="metadata"
                  aria-label="Klaus Way — Our Story"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4 px-1 text-sm">
                <p className="font-medium text-foreground">Watch our story</p>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  1:30 · Sound on
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-600">
              What we stand for
            </p>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight md:text-4xl">
              We build. We connect.{" "}
              <span className="text-brand-600">We simplify.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              {brand.supportingLine}
            </p>
          </Reveal>

          <div className="mx-auto mt-14 max-w-3xl divide-y divide-border border-y border-border">
            {brand.pillars.map((pillar, i) => (
              <Reveal
                key={pillar.title}
                delay={((i % 3) * 100) as 0 | 100 | 200}
                className="grid gap-3 py-8 sm:grid-cols-[4rem_1fr] sm:gap-8"
              >
                <span className="font-mono text-xs font-semibold tracking-widest text-brand-600">
                  {pillar.number}
                </span>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {pillar.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Our Values
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal
                key={value.title}
                delay={((i % 4) * 100) as 0 | 100 | 200 | 300}
                className="hover-lift rounded-2xl border border-border bg-card p-6 text-center backdrop-blur transition-all hover:border-border-strong hover:bg-card"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-surface-2 text-brand-600">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold">{value.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {value.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="relative border-t border-border py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-muted-foreground">
              The people building technology that works for your business.
            </p>
          </Reveal>

          <TeamGrid members={teamMembers} />
        </div>
      </section>
    </>
  );
}
