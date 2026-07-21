"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const deals = [
  { name: "Pied Piper", value: "$48,000", time: "just now" },
  { name: "Wayne Tech", value: "$65,000", time: "2 min ago" },
  { name: "Massive Dynamic", value: "$85,000", time: "5 min ago" },
  { name: "Hooli Inc.", value: "$25,000", time: "9 min ago" },
  { name: "Acme Corporation", value: "$8,500", time: "12 min ago" },
];

/**
 * Floating "new deal closed" toast that cycles through deals every few seconds.
 * The fade is a CSS transition keyed off the deal id.
 */
export function RotatingDealNotification({
  className,
}: {
  className?: string;
}) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      if (document.hidden) return;
      setIdx((i) => (i + 1) % deals.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const deal = deals[idx];

  return (
    <div
      className={`${className ?? ""} rounded-xl border border-black/10 bg-card/95 p-3 shadow-xl shadow-black/10 backdrop-blur`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-500/20 text-lime-600">
            <TrendingUp className="h-4 w-4" />
          </div>
          <span className="absolute inset-0 rounded-full bg-lime-400/40 animate-ping-soft" />
        </div>
        <div className="min-w-0 flex-1">
          <div key={`title-${idx}`} className="text-xs font-medium animate-fade-up">
            New deal closed!
          </div>
          <div key={`name-${idx}`} className="mt-0.5 text-[11px] text-muted-foreground animate-fade-up">
            {deal.name} · {deal.value}
          </div>
          <div key={`time-${idx}`} className="mt-1 text-[10px] text-muted-foreground/80 animate-fade-up">
            {deal.time}
          </div>
        </div>
      </div>
    </div>
  );
}
