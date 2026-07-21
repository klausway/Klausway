import { MessageCircle, Mail, Send } from "lucide-react";
import { Typewriter } from "@/components/animation/typewriter";

const conversations = [
  {
    name: "Bruce Wayne",
    channel: "Email",
    channelColor: "bg-rose-500",
    preview: "Can you send over a revised quote for the enterprise tier?",
    time: "2m",
    unread: 2,
    active: true,
  },
  {
    name: "Initech LLC",
    channel: "Email",
    channelColor: "bg-blue-500",
    preview: "Re: Proposal for Q1 implementation",
    time: "15m",
    unread: 1,
  },
  {
    name: "Olivia Chen",
    channel: "SMS",
    channelColor: "bg-emerald-500",
    preview: "Got it, talk Monday at 10. Thanks!",
    time: "1h",
    unread: 0,
  },
  {
    name: "@hooli_official",
    channel: "Instagram",
    channelColor: "bg-fuchsia-500",
    preview: "📷 sent a photo",
    time: "3h",
    unread: 0,
  },
];

export function InboxVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/60 backdrop-blur">
        <div className="grid grid-cols-5">
          <div className="col-span-2 border-r border-black/[0.08]">
            <div className="border-b border-black/[0.08] p-3">
              <div className="text-xs font-semibold">Unified Inbox</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                4 new messages
              </div>
            </div>
            <div>
              {conversations.map((c, i) => (
                <div
                  key={i}
                  className={`flex cursor-pointer items-start gap-2 border-b border-black/[0.08] p-3 transition-colors ${
                    c.active ? "bg-black/[0.03]" : "hover:bg-black/[0.02]"
                  }`}
                >
                  <div className="relative">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-[9px] font-semibold text-white">
                      {c.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-card ${c.channelColor}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate text-[10px] font-medium">
                        {c.name}
                      </span>
                      <span className="shrink-0 text-[9px] text-muted-foreground">
                        {c.time}
                      </span>
                    </div>
                    <div className="mt-0.5 truncate text-[10px] text-muted-foreground">
                      {c.preview}
                    </div>
                  </div>
                  {c.unread > 0 && (
                    <span className="flex h-4 min-w-[1rem] shrink-0 items-center justify-center rounded-full bg-brand-500 px-1 text-[9px] font-semibold text-white">
                      {c.unread}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-3 flex flex-col">
            <div className="flex items-center justify-between border-b border-black/[0.08] p-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-[9px] font-semibold text-white">
                    BW
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-card bg-rose-500" />
                </div>
                <div>
                  <div className="text-xs font-medium">Bruce Wayne</div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <MessageCircle className="h-2.5 w-2.5" />
                    Email · Wayne Enterprises
                  </div>
                </div>
              </div>
              <button className="rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-[10px]">
                View deal
              </button>
            </div>

            <div className="flex-1 space-y-2 p-3">
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-black/[0.03] px-3 py-2 text-[10px]">
                  Hi! Just reviewing the package you sent over.
                </div>
              </div>
              <div className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-brand-500/20 px-3 py-2 text-[10px]">
                  Hi Bruce — thanks for taking a look. Any questions I
                  can help with?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-black/[0.03] px-3 py-2 text-[10px]">
                  Can you send over a revised quote for the enterprise tier?
                </div>
              </div>

              <div className="rounded-lg border border-dashed border-brand-400/30 bg-brand-500/5 p-2">
                <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-brand-600">
                  AI suggested reply
                  <span className="typing-dots">
                    <span />
                    <span />
                    <span />
                  </span>
                </div>
                <div className="mt-1 text-[10px]">
                  &ldquo;
                  <Typewriter
                    text="Absolutely. Could you share the seat count and any specific add-ons you're considering? I'll have a revised quote in your inbox within 30 minutes."
                    speed={18}
                    startDelay={400}
                  />
                  &rdquo;
                </div>
              </div>
            </div>

            <div className="border-t border-black/[0.08] p-2">
              <div className="flex items-center gap-2 rounded-lg border border-black/10 bg-background/60 px-3 py-1.5">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <input
                  readOnly
                  placeholder="Type a reply..."
                  className="flex-1 bg-transparent text-[10px] outline-none"
                />
                <button className="flex h-5 w-5 items-center justify-center rounded bg-brand-500 text-white">
                  <Send className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
