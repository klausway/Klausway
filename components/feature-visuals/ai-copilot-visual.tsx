import { Sparkles, Send, ThumbsUp } from "lucide-react";
import { Typewriter } from "@/components/animation/typewriter";

export function AiCopilotVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-fuchsia-500/15 to-brand-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/60 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-black/[0.08] bg-gradient-to-r from-brand-500/10 to-fuchsia-500/10 px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold">AI Sales Copilot</div>
            <div className="text-[10px] text-muted-foreground">
              Analyzing: Wayne Tech deal
            </div>
          </div>
          <div className="ml-auto flex items-center gap-1 rounded-full bg-lime-500/10 px-2 py-0.5 text-[10px] font-medium text-lime-600">
            <span className="typing-dots">
              <span />
              <span />
              <span />
            </span>
            Thinking
          </div>
        </div>

        <div className="space-y-3 p-4">
          <div className="flex justify-end">
            <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500/15 px-3 py-2 text-xs">
              Draft a follow-up email for Wayne Tech.
              We sent them a proposal last week.
            </div>
          </div>

          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white">
              <Sparkles className="h-3 w-3" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="rounded-2xl rounded-tl-sm border border-black/[0.08] bg-background/60 p-3">
                <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                  Suggested email draft
                </div>
                <div className="space-y-1.5 text-xs text-foreground/90">
                  <div className="text-muted-foreground">
                    Subject: Following up on the Wayne Tech proposal
                  </div>
                  <div className="border-t border-black/[0.08] pt-1.5">
                    Hi Bruce,
                  </div>
                  <div>
                    <Typewriter
                      text="Hope your week is off to a great start. I wanted to check in on the proposal we sent over last Tuesday—happy to walk you through any details or adjust the scope to better fit your team's needs. Would Thursday at 2pm PT work for a quick 20-minute call?"
                      speed={14}
                      startDelay={600}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <button className="rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background">
                    Send email
                  </button>
                  <button className="rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-[10px] text-foreground">
                    Edit
                  </button>
                  <button className="ml-auto rounded-md p-1 text-muted-foreground">
                    <ThumbsUp className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-lime-400/20 bg-lime-500/5 p-3">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-lime-600">
                  <span className="h-1 w-1 rounded-full bg-lime-400" />
                  AI INSIGHT
                </div>
                <div className="mt-1 text-xs text-foreground/80">
                  This deal has an <span className="font-semibold text-lime-600">87%</span>
                  {" "}probability of closing — following up today adds another 12%.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/[0.08] p-3">
          <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-background/60 px-3 py-2">
            <input
              readOnly
              placeholder="Ask AI Copilot anything..."
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            <button className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white">
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
