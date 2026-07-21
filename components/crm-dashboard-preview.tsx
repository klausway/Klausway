"use client";

import {
  Search,
  Plus,
  Bell,
  Filter,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { LiveTicker } from "./animation/live-ticker";
import { RotatingDealNotification } from "./animation/rotating-notification";
import { Logo } from "./logo";

const pipelineStages = [
  {
    name: "New Lead",
    count: 24,
    value: "$48K",
    color: "bg-slate-500/80",
    deals: [
      { name: "Acme Corporation", value: "$8,500", avatar: "AC" },
      { name: "Globex Industries", value: "$12,000", avatar: "GI" },
      { name: "Stark Enterprises", value: "$4,500", avatar: "SE" },
    ],
  },
  {
    name: "Contacted",
    count: 18,
    value: "$112K",
    color: "bg-blue-500/80",
    deals: [
      { name: "Hooli Inc.", value: "$25,000", avatar: "HI" },
      { name: "Initech LLC", value: "$18,000", avatar: "IL" },
    ],
  },
  {
    name: "Proposal",
    count: 12,
    value: "$184K",
    color: "bg-amber-500/80",
    deals: [
      { name: "Wayne Tech", value: "$65,000", avatar: "WT" },
      { name: "Soylent Foods", value: "$32,000", avatar: "SF" },
    ],
  },
  {
    name: "Closed Won",
    count: 8,
    value: "$128K",
    color: "bg-lime-500/80",
    deals: [
      { name: "Pied Piper", value: "$48,000", avatar: "PP" },
      { name: "Massive Dynamic", value: "$85,000", avatar: "MD" },
    ],
  },
];

export function CrmDashboardPreview() {
  return (
    <div className="relative mx-auto max-w-6xl">
      <div className="absolute -inset-x-8 -inset-y-4 -z-10 rounded-3xl bg-gradient-to-b from-brand-500/10 via-fuchsia-500/5 to-transparent blur-2xl" />

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-card/80 shadow-xl shadow-black/10 backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-black/[0.08] bg-black/[0.02] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <span className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-black/[0.08] bg-background/50 px-3 py-1 text-xs text-muted-foreground md:flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-lime-400/60 animate-ping-soft" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
            </span>
            app.klausway.com/portal
          </div>
          <div className="w-12" />
        </div>

        <div className="flex">
          <aside className="hidden w-56 shrink-0 border-r border-black/[0.08] bg-background/40 p-4 lg:block">
            <div className="mb-6 px-2">
              <Logo height={28} textClassName="text-sm" />
            </div>
            <nav className="space-y-0.5">
              {[
                { name: "Portal Home", active: false },
                { name: "Klaus Connect", active: true },
                { name: "Customer Portal", active: false },
                { name: "n8n Console", active: false },
                { name: "AI Call Center", active: false },
                { name: "Reports", active: false },
                { name: "Spendledger", active: false },
              ].map((item) => (
                <div
                  key={item.name}
                  className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs ${
                    item.active
                      ? "bg-black/[0.05] font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.active ? "bg-brand-400" : "bg-black/20"
                    }`}
                  />
                  {item.name}
                </div>
              ))}
            </nav>

            <div className="mt-6 rounded-lg border border-black/[0.08] bg-gradient-to-br from-brand-500/10 to-fuchsia-500/10 p-3">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-600">
                AI Copilot
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                5 deals need your attention today
              </div>
            </div>
          </aside>

          <main className="flex-1 p-5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-muted-foreground">
                  Q1 2026 · This quarter
                </div>
                <div className="mt-0.5 text-lg font-semibold">
                  Klaus Connect — Pipeline
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 rounded-lg border border-black/[0.08] bg-background/50 px-3 py-1.5 text-xs text-muted-foreground md:flex">
                  <Search className="h-3.5 w-3.5" />
                  Search...
                </div>
                <button className="rounded-lg border border-black/[0.08] bg-background/50 p-2">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button className="rounded-lg border border-black/[0.08] bg-background/50 p-2">
                  <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
                <button className="flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background">
                  <Plus className="h-3.5 w-3.5" />
                  New deal
                </button>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              <KpiCard
                icon={<DollarSign className="h-3.5 w-3.5" />}
                label="Revenue MTD"
                value={
                  <LiveTicker
                    start={284120}
                    maxIncrement={420}
                    format="money-thousands"
                    decimals={1}
                  />
                }
                change="+12.5%"
                positive
              />
              <KpiCard
                icon={<Target className="h-3.5 w-3.5" />}
                label="Win rate"
                value="68%"
                change="+4.2%"
                positive
              />
              <KpiCard
                icon={<Users className="h-3.5 w-3.5" />}
                label="New customers"
                value="142"
                change="+8.1%"
                positive
              />
              <KpiCard
                icon={<TrendingDown className="h-3.5 w-3.5" />}
                label="Avg. deal cycle"
                value="18 days"
                change="−3 days"
                positive
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {pipelineStages.map((stage, sIdx) => (
                <div
                  key={stage.name}
                  className="hover-lift rounded-lg border border-black/[0.08] bg-background/40 p-3 hover:border-black/10 hover:bg-background/60 animate-fade-up-stagger"
                  style={{ animationDelay: `${100 + sIdx * 100}ms` }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                      <span className="text-xs font-medium">{stage.name}</span>
                    </div>
                    <span className="rounded-full bg-black/[0.03] px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {stage.count}
                    </span>
                  </div>
                  <div className="mb-3 text-sm font-semibold">{stage.value}</div>
                  <div className="space-y-2">
                    {stage.deals.map((deal, i) => (
                      <DealCard
                        key={i}
                        deal={deal}
                        stageColor={stage.color}
                        index={sIdx * 4 + i}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <RotatingDealNotification className="absolute -right-6 top-32 hidden w-64 xl:block animate-fade-up" />

      <div
        className="absolute -left-4 bottom-24 hidden w-64 rounded-xl border border-black/10 bg-card/95 p-3 shadow-xl shadow-black/10 backdrop-blur xl:block animate-fade-up-stagger"
        style={{ animationDelay: "600ms" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-fuchsia-500 text-white">
            <Sparkles className="h-4 w-4 animate-bounce-subtle" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-medium">
              AI Copilot suggests
              <span className="typing-dots text-brand-600">
                <span />
                <span />
                <span />
              </span>
            </div>
            <div className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              Follow up with Wayne Tech — 87% chance of closing
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  change,
  positive,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="hover-lift group rounded-lg border border-black/[0.08] bg-background/40 p-3 hover:border-black/10 hover:bg-background/60 hover:shadow-lg hover:shadow-brand-500/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-muted-foreground transition-colors group-hover:text-brand-600">
          {icon}
          <span className="text-[10px] uppercase tracking-wider">{label}</span>
        </div>
        <MoreHorizontal className="h-3 w-3 text-muted-foreground/50" />
      </div>
      <div className="mt-1.5 text-base font-semibold tabular-nums">{value}</div>
      <div
        className={`mt-0.5 text-[10px] ${
          positive ? "text-lime-600" : "text-rose-400"
        }`}
      >
        {change} vs last month
      </div>
    </div>
  );
}

function DealCard({
  deal,
  stageColor,
  index = 0,
}: {
  deal: { name: string; value: string; avatar: string };
  stageColor: string;
  index?: number;
}) {
  return (
    <div
      className="cursor-grab rounded-md border border-black/[0.08] bg-background/60 p-2 transition-all hover:-translate-y-0.5 hover:border-black/15 hover:bg-background/80 hover:shadow-md hover:shadow-black/8 animate-fade-up-stagger"
      style={{ animationDelay: `${250 + index * 40}ms` }}
    >
      <div className="text-[11px] font-medium leading-tight">{deal.name}</div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{deal.value}</span>
        <div
          className={`flex h-4 w-4 items-center justify-center rounded-full ${stageColor} text-[8px] font-semibold text-white`}
        >
          {deal.avatar.slice(0, 2)}
        </div>
      </div>
    </div>
  );
}
