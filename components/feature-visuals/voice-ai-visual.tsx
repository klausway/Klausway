import { AudioLines, PhoneCall, CircleCheck, CalendarCheck } from "lucide-react";
import { Typewriter } from "@/components/animation/typewriter";

const waveform = [
  6, 12, 20, 14, 26, 18, 30, 22, 12, 8, 16, 24, 32, 20, 10, 18, 28, 14, 22, 30,
  16, 8, 14, 24, 18, 10,
] as const;

export function VoiceAiVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-teal-500/10 to-emerald-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="flex items-center gap-2 border-b border-border bg-gradient-to-r from-teal-500/10 to-emerald-500/10 px-4 py-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 text-white">
            <PhoneCall className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="text-xs font-semibold">Voice AI Agent</div>
            <div className="text-[10px] text-muted-foreground">
              Inbound call · +1 (415) ••• ••41
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
              02:34
            </span>
            <div className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-red-400/60 animate-ping-soft" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              Live
            </div>
          </div>
        </div>

        <div className="border-b border-border px-4 py-3">
          <div className="flex h-9 items-center justify-center gap-[3px]">
            {waveform.map((h, i) => (
              <span
                key={i}
                className="w-[3px] rounded-full bg-gradient-to-t from-teal-500 to-emerald-400"
                style={{ height: `${h}px`, opacity: 0.45 + (h / 32) * 0.55 }}
              />
            ))}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
            <AudioLines className="h-2.5 w-2.5" />
            Agent speaking · natural voice
          </div>
        </div>

        <div className="space-y-2.5 p-4">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-surface-2 px-3 py-2 text-[11px]">
              Hi, I&rsquo;d like to move my appointment from Thursday to
              sometime Friday afternoon.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-white">
              <AudioLines className="h-3 w-3" />
            </div>
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-background/60 px-3 py-2 text-[11px]">
              <Typewriter
                text="Of course — I can help with that. I see your Thursday 10 AM appointment. Friday I have 1:30 or 3:00 PM available. Which works better?"
                speed={16}
                startDelay={500}
              />
            </div>
          </div>

          <div className="rounded-lg border border-dashed border-teal-400/30 bg-teal-500/5 p-2.5">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-teal-600">
              Understood intent
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {["Reschedule appointment", "Thu → Fri PM", "Existing customer"].map(
                (chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-surface-2 px-2 py-0.5 text-[9px] font-medium"
                  >
                    {chip}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <CalendarCheck className="h-3 w-3 text-teal-600" />
            Calendar &amp; CRM updated automatically
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface-2 px-2 py-1 text-[10px] font-medium">
            <CircleCheck className="h-3 w-3 text-emerald-600" />
            94% resolved without staff
          </div>
        </div>
      </div>
    </div>
  );
}
