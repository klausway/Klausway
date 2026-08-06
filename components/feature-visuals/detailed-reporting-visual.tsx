import { ArrowUpRight, Globe2 } from "lucide-react";

const regions = [
  { name: "West", value: "$842K", pct: 100 },
  { name: "East", value: "$611K", pct: 73 },
  { name: "South", value: "$488K", pct: 58 },
  { name: "Midwest", value: "$340K", pct: 40 },
] as const;

const kpis = [
  { label: "Net profit", value: "$1.86M", delta: "+21.4%" },
  { label: "Profit margin", value: "34.2%", delta: "+2.8 pts" },
  { label: "Top region", value: "West", delta: "+18.0%" },
] as const;

export function DetailedReportingVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/10 to-violet-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Profitability by Region</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              Custom report · Apr – Oct
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-lg border border-border bg-surface-2 p-0.5 text-[10px]">
            <span className="rounded-md px-2 py-0.5 text-muted-foreground">30d</span>
            <span className="rounded-md px-2 py-0.5 text-muted-foreground">90d</span>
            <span className="rounded-md bg-background px-2 py-0.5 font-medium shadow-sm">
              12m
            </span>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-lg border border-border bg-background/30 p-2.5"
            >
              <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
              <div className="mt-0.5 text-base font-semibold tabular-nums">
                {kpi.value}
              </div>
              <div className="flex items-center gap-0.5 text-[10px] text-lime-600">
                <ArrowUpRight className="h-2.5 w-2.5" />
                {kpi.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="relative rounded-lg border border-border bg-background/30 p-4">
          <div className="mb-2 flex items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
              This period
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-0 w-3 border-t-2 border-dashed border-muted-foreground/50" />
              Last period
            </div>
          </div>

          <div className="relative">
            <svg
              viewBox="0 0 320 130"
              className="w-full text-brand-500"
              role="img"
              aria-label="Line chart of profit this period versus last period, April through October"
            >
              <defs>
                <linearGradient id="drv-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* gridlines */}
              <g className="stroke-border" strokeWidth="1">
                <line x1="0" y1="30" x2="320" y2="30" />
                <line x1="0" y1="60" x2="320" y2="60" />
                <line x1="0" y1="90" x2="320" y2="90" />
                <line x1="0" y1="120" x2="320" y2="120" />
              </g>

              {/* last period — dashed reference */}
              <path
                d="M 10 106 C 27 103, 43 99, 60 98 S 93 101, 110 100 S 143 90, 160 86 S 193 91, 210 90 S 243 78, 260 74 S 293 68, 310 66"
                fill="none"
                className="stroke-muted-foreground"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                opacity="0.45"
              />

              {/* this period — area + line */}
              <path
                d="M 10 95 C 27 89, 43 82, 60 80 S 93 90, 110 88 S 143 66, 160 60 S 193 70, 210 68 S 243 44, 260 38 S 293 30, 310 28 L 310 120 L 10 120 Z"
                fill="url(#drv-area)"
              />
              <path
                d="M 10 95 C 27 89, 43 82, 60 80 S 93 90, 110 88 S 143 66, 160 60 S 193 70, 210 68 S 243 44, 260 38 S 293 30, 310 28"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* highlighted point */}
              <circle cx="260" cy="38" r="8" fill="currentColor" opacity="0.15" />
              <circle
                cx="260"
                cy="38"
                r="4"
                fill="currentColor"
                className="stroke-card"
                strokeWidth="2"
              />
              <line
                x1="260"
                y1="44"
                x2="260"
                y2="120"
                stroke="currentColor"
                strokeWidth="1"
                strokeDasharray="2 3"
                opacity="0.4"
              />
            </svg>

            {/* tooltip callout for highlighted point */}
            <div className="absolute right-[8%] top-0 -translate-y-1 rounded-lg border border-border bg-card px-2.5 py-1.5 shadow-md">
              <div className="text-[9px] text-muted-foreground">September</div>
              <div className="text-[11px] font-semibold tabular-nums">$412K</div>
              <div className="flex items-center gap-0.5 text-[9px] text-lime-600">
                <ArrowUpRight className="h-2.5 w-2.5" />
                +18% vs last period
              </div>
            </div>

            <div className="mt-1 flex justify-between px-1 text-[9px] text-muted-foreground">
              <span>Apr</span>
              <span>Jun</span>
              <span>Aug</span>
              <span>Oct</span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-border bg-background/30 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Revenue by Region
            </div>
            <Globe2 className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            {regions.map((region) => (
              <div key={region.name} className="flex items-center gap-2">
                <div className="w-14 truncate text-[10px]">{region.name}</div>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-400 to-violet-500"
                    style={{ width: `${region.pct}%` }}
                  />
                </div>
                <div className="w-12 text-right text-[10px] font-medium tabular-nums">
                  {region.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
