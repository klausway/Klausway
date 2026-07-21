import { TrendingUp, ArrowUpRight } from "lucide-react";
import { AnimatedBarChart } from "@/components/animation/animated-bar-chart";
import { AnimatedCounter } from "@/components/animation/animated-counter";

const barData = [62, 88, 74, 95, 110, 132, 118, 145, 168, 158, 180, 210];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function AnalyticsVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-rose-500/10 to-amber-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/60 p-5 backdrop-blur">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Revenue Performance</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              Last 12 months
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-md bg-black/[0.03] px-2 py-1 text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              This year
            </div>
            <div className="flex items-center gap-1 rounded-md bg-black/[0.03] px-2 py-1 text-[10px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-black/25" />
              Last year
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="hover-lift rounded-lg border border-black/[0.08] bg-background/30 p-2.5 hover:border-black/10">
            <div className="text-[10px] text-muted-foreground">Total revenue</div>
            <div className="mt-0.5 text-base font-semibold tabular-nums">
              <AnimatedCounter to={2.48} decimals={2} prefix="$" suffix="M" />
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-lime-600">
              <ArrowUpRight className="h-2.5 w-2.5" />
              +28.4%
            </div>
          </div>
          <div className="hover-lift rounded-lg border border-black/[0.08] bg-background/30 p-2.5 hover:border-black/10">
            <div className="text-[10px] text-muted-foreground">Deals closed</div>
            <div className="mt-0.5 text-base font-semibold tabular-nums">
              <AnimatedCounter to={348} />
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-lime-600">
              <ArrowUpRight className="h-2.5 w-2.5" />
              +12.1%
            </div>
          </div>
          <div className="hover-lift rounded-lg border border-black/[0.08] bg-background/30 p-2.5 hover:border-black/10">
            <div className="text-[10px] text-muted-foreground">Avg. deal size</div>
            <div className="mt-0.5 text-base font-semibold tabular-nums">
              <AnimatedCounter to={7.1} decimals={1} prefix="$" suffix="K" />
            </div>
            <div className="flex items-center gap-0.5 text-[10px] text-lime-600">
              <ArrowUpRight className="h-2.5 w-2.5" />
              +14.6%
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-black/[0.08] bg-background/30 p-4">
          <AnimatedBarChart data={barData} labels={months} />
        </div>

        <div className="mt-4 rounded-lg border border-black/[0.08] bg-background/30 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Top Sales Performers
            </div>
            <TrendingUp className="h-3 w-3 text-lime-600" />
          </div>
          <div className="space-y-1.5">
            {[
              { name: "Sarah Mitchell", value: "$420K", pct: 100 },
              { name: "James Rodriguez", value: "$360K", pct: 86 },
              { name: "Priya Patel", value: "$290K", pct: 69 },
            ].map((p, idx) => (
              <div
                key={p.name}
                className="flex items-center gap-2 animate-fade-up-stagger"
                style={{ animationDelay: `${100 + idx * 100}ms` }}
              >
                <div className="w-24 truncate text-[10px]">{p.name}</div>
                <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.03]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 animate-grow-bar-x"
                    style={{
                      width: `${p.pct}%`,
                      animationDelay: `${400 + idx * 150}ms`,
                    }}
                  />
                </div>
                <div className="w-12 text-right text-[10px] font-medium tabular-nums">
                  {p.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
