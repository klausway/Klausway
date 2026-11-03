"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { TeamMemberPhoto } from "./team-member-photo";
import {
  TEAM_BIO_HEADING_PREFIX,
  isTeamBioHeading,
  type TeamMember,
} from "@/lib/about";

function MemberHead({ member }: { member: TeamMember }) {
  return (
    <div className="flex items-center gap-4">
      <TeamMemberPhoto
        member={member}
        className="aspect-square h-16 w-16 shrink-0 rounded-full"
      />
      <div className="min-w-0">
        <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
        <p className="text-sm text-brand-600">{member.role}</p>
      </div>
    </div>
  );
}

function TeamCard({ member, onOpen }: { member: TeamMember; onOpen: () => void }) {
  const hasBio = (member.bio ?? []).length > 0;

  return (
    <>
      <TeamMemberPhoto member={member} className="rounded-none" />
      <div className="p-5 text-center">
        <h3 className="text-lg font-semibold tracking-tight">{member.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
        {hasBio ? (
          <button
            type="button"
            onClick={onOpen}
            className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 transition-colors hover:text-brand-700"
          >
            Read bio
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        ) : null}
      </div>
    </>
  );
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const [active, setActive] = useState<TeamMember | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member, i) => (
          <Reveal
            key={member.slug}
            delay={((i % 4) * 100) as 0 | 100 | 200 | 300}
            className="hover-lift group overflow-hidden rounded-2xl border border-border bg-card backdrop-blur transition-all hover:border-border-strong hover:bg-card hover:shadow-xl hover:shadow-black/8"
          >
            <TeamCard member={member} onOpen={() => setActive(member)} />
          </Reveal>
        ))}
      </div>

      {active ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />
          <div className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-6">
              <MemberHead member={active} />
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Close"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 overflow-y-auto p-6 text-sm leading-relaxed text-muted-foreground">
              {(active.bio ?? []).map((entry, i) =>
                isTeamBioHeading(entry) ? (
                  <h4 key={i} className="pt-2 text-base font-semibold text-foreground">
                    {entry.slice(TEAM_BIO_HEADING_PREFIX.length)}
                  </h4>
                ) : (
                  <p key={i}>{entry}</p>
                ),
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
