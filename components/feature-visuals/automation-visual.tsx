import { Zap, Mail, Bell, ListChecks, GitBranch } from "lucide-react";

const nodes = [
  {
    id: "trigger",
    icon: <Zap className="h-4 w-4" />,
    title: "When new lead arrives",
    subtitle: "Trigger · Form submission",
    color: "from-amber-400 to-orange-500",
    badge: "TRIGGER",
  },
  {
    id: "branch",
    icon: <GitBranch className="h-4 w-4" />,
    title: "Check deal value",
    subtitle: "If/Else · Deal value > $10K",
    color: "from-violet-400 to-fuchsia-500",
    badge: "CONDITION",
  },
  {
    id: "email",
    icon: <Mail className="h-4 w-4" />,
    title: "Send welcome email",
    subtitle: "Action · Template: Welcome VIP",
    color: "from-brand-400 to-brand-600",
    badge: "ACTION",
  },
  {
    id: "task",
    icon: <ListChecks className="h-4 w-4" />,
    title: "Create task for AE",
    subtitle: "Action · Assign to top performer",
    color: "from-lime-400 to-emerald-500",
    badge: "ACTION",
  },
  {
    id: "notify",
    icon: <Bell className="h-4 w-4" />,
    title: "Notify in Slack",
    subtitle: "Action · #sales-deals",
    color: "from-cyan-400 to-blue-500",
    badge: "ACTION",
  },
];

export function AutomationVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-violet-500/10 to-amber-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">High-Value Lead Workflow</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              Active · 248 runs this month
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-lime-500/10 px-2 py-0.5 text-[10px] font-medium text-lime-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-lime-400/60 animate-ping-soft" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
            </span>
            Running
          </div>
        </div>

        <div className="space-y-2">
          {nodes.map((node, idx) => (
            <div
              key={node.id}
              className="animate-fade-up-stagger"
              style={{ animationDelay: `${100 + idx * 120}ms` }}
            >
              <div className="group flex items-center gap-3 rounded-xl border border-black/[0.08] bg-background/40 p-3 transition-all hover:-translate-y-px hover:border-black/15 hover:bg-background/60 hover:shadow-md">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${node.color} text-white shadow-lg transition-transform group-hover:scale-110`}
                >
                  {node.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium">{node.title}</span>
                    <span className="rounded bg-black/[0.03] px-1.5 py-0.5 text-[8px] font-semibold tracking-wider text-muted-foreground">
                      {node.badge}
                    </span>
                  </div>
                  <div className="mt-0.5 text-[10px] text-muted-foreground">
                    {node.subtitle}
                  </div>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {idx === 0 ? "248×" : idx === 1 ? "248×" : `${248 - idx * 12}×`}
                </div>
              </div>
              {idx < nodes.length - 1 && (
                <div className="my-1 ml-[1.125rem] h-3 w-0.5 bg-gradient-to-b from-white/20 to-transparent" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between rounded-lg border border-black/[0.08] bg-background/30 p-3">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <div className="text-[10px] text-muted-foreground">
              Saves <span className="font-semibold text-foreground">12.4 hrs</span>
              {" "}/ month
            </div>
          </div>
          <button className="rounded-md border border-black/10 bg-black/[0.03] px-2 py-1 text-[10px] text-foreground">
            View history
          </button>
        </div>
      </div>
    </div>
  );
}
