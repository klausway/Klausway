import { GripVertical } from "lucide-react";

const stages = [
  { name: "Lead", color: "bg-slate-400", count: 12, value: "$42K" },
  { name: "Qualified", color: "bg-blue-400", count: 8, value: "$120K" },
  { name: "Proposal", color: "bg-amber-400", count: 5, value: "$240K" },
  { name: "Won", color: "bg-lime-400", count: 3, value: "$180K" },
];

const deals = [
  { stage: 0, name: "Acme Corp", value: "$8.5K", color: "from-slate-500/30 to-slate-400/10" },
  { stage: 0, name: "Globex Industries", value: "$12K", color: "from-slate-500/30 to-slate-400/10" },
  { stage: 1, name: "Wayne Tech", value: "$65K", color: "from-blue-500/30 to-blue-400/10" },
  { stage: 2, name: "Pied Piper", value: "$120K", color: "from-amber-500/30 to-amber-400/10" },
  { stage: 3, name: "Massive Dynamic", value: "$85K", color: "from-lime-500/30 to-lime-400/10" },
];

export function PipelineVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-brand-500/10 to-fuchsia-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm font-medium">Q1 2026 Pipeline</div>
          <div className="rounded-md border border-black/[0.08] bg-background/50 px-2 py-1 text-[10px] text-muted-foreground">
            Last 30 days
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {stages.map((stage, sidx) => (
            <div key={stage.name} className="space-y-2">
              <div className="rounded-lg border border-black/[0.08] bg-background/40 p-2.5">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${stage.color}`} />
                  <span className="text-[10px] font-medium">{stage.name}</span>
                </div>
                <div className="mt-1.5 text-[10px] text-muted-foreground">
                  {stage.count} deals
                </div>
                <div className="mt-0.5 text-sm font-semibold">{stage.value}</div>
              </div>
              {deals
                .filter((d) => d.stage === sidx)
                .map((deal, i) => (
                  <div
                    key={i}
                    className={`group relative rounded-lg border border-black/10 bg-gradient-to-br ${deal.color} p-2.5 backdrop-blur`}
                  >
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <div className="truncate text-[10px] font-medium">
                          {deal.name}
                        </div>
                        <div className="mt-0.5 text-[10px] text-muted-foreground">
                          {deal.value}
                        </div>
                      </div>
                      <GripVertical className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 rounded-lg border border-black/[0.08] bg-background/30 p-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Total Pipeline
            </div>
            <div className="mt-0.5 text-base font-semibold">$582K</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Forecasted
            </div>
            <div className="mt-0.5 text-base font-semibold text-lime-600">
              $210K
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Win Rate
            </div>
            <div className="mt-0.5 text-base font-semibold">68%</div>
          </div>
        </div>
      </div>
    </div>
  );
}
