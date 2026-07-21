import { Reveal } from "./animation/reveal";
import {
  aboutPageHeader,
  missionVision,
  ourStory,
  teamMembers,
  values,
} from "@/lib/about";
import { cn } from "@/lib/utils";

export function AboutSection() {
  return (
    <>
      <section id="story" className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {ourStory.title}
              </h2>
              <div className="mt-6 space-y-4 text-base leading-relaxed text-muted-foreground">
                {ourStory.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-black/10 bg-gradient-to-br from-brand-500/10 via-card/40 to-fuchsia-500/10">
                <div className="absolute inset-0 dot-pattern opacity-40" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-2xl border border-black/10 bg-background/60 px-8 py-6 text-center backdrop-blur">
                    <div className="text-sm font-semibold uppercase tracking-wider text-brand-600">
                      Team collaboration
                    </div>
                    <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                      {aboutPageHeader.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="relative border-t border-black/[0.08] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 md:grid-cols-2">
            {missionVision.map((item, i) => (
              <Reveal
                key={item.title}
                delay={(i * 100) as 0 | 100}
                className="hover-lift rounded-2xl border border-black/[0.08] bg-card/40 p-8 backdrop-blur transition-all hover:border-black/10 hover:bg-card/60"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white shadow-lg">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="relative border-t border-black/[0.08] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Our Values
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, i) => (
              <Reveal
                key={value.title}
                delay={((i % 4) * 100) as 0 | 100 | 200 | 300}
                className="hover-lift rounded-2xl border border-black/[0.08] bg-card/40 p-6 text-center backdrop-blur transition-all hover:border-black/10 hover:bg-card/60"
              >
                <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-black/[0.03] text-brand-600">
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

      <section id="team" className="relative border-t border-black/[0.08] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              Meet Our Team
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, i) => (
              <Reveal
                key={member.name}
                delay={((i % 4) * 100) as 0 | 100 | 200 | 300}
                className="hover-lift group rounded-2xl border border-black/[0.08] bg-card/40 p-6 text-center backdrop-blur transition-all hover:border-black/10 hover:bg-card/60"
              >
                <div
                  className={cn(
                    "mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl font-semibold text-white shadow-lg transition-transform group-hover:scale-105",
                    member.accent,
                  )}
                >
                  {member.initials}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{member.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {member.role}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
