import { Package, TriangleAlert, ShoppingCart, CircleCheck } from "lucide-react";

const items = [
  {
    name: "Copper Pipe 3/4\"",
    sku: "PLB-0341",
    onHand: 182,
    level: 78,
    barColor: "from-emerald-400 to-teal-500",
    badge: { label: "In stock", className: "bg-emerald-500/10 text-emerald-600" },
  },
  {
    name: "Breaker Panel 200A",
    sku: "ELC-1120",
    onHand: 46,
    level: 52,
    barColor: "from-emerald-400 to-teal-500",
    badge: { label: "In stock", className: "bg-emerald-500/10 text-emerald-600" },
  },
  {
    name: "PVC Fitting Kit",
    sku: "PLB-0987",
    onHand: 14,
    level: 18,
    barColor: "from-amber-400 to-orange-500",
    badge: { label: "Low stock", className: "bg-amber-500/10 text-amber-600" },
  },
  {
    name: "Thermostat Wire 250ft",
    sku: "HVC-2205",
    onHand: 3,
    level: 6,
    barColor: "from-red-400 to-rose-500",
    badge: { label: "Reorder", className: "bg-red-500/10 text-red-600" },
  },
] as const;

export function InventoryVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div>
            <div className="text-xs font-semibold">Warehouse A · Stock Levels</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              1,248 SKUs · 3 locations
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
            <TriangleAlert className="h-2.5 w-2.5" />
            2 below reorder point
          </div>
        </div>

        <div className="p-3">
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.sku}
                className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-2.5"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-[11px] font-medium">
                      {item.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${item.badge.className}`}
                    >
                      {item.badge.label}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="font-mono text-[9px] text-muted-foreground">
                      {item.sku}
                    </span>
                    <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${item.barColor}`}
                        style={{ width: `${item.level}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-[9px] font-medium">
                      {item.onHand} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <ShoppingCart className="h-3.5 w-3.5 text-brand-600" />
            <span>
              PO{" "}
              <span className="font-semibold text-foreground">#2041</span>{" "}
              auto-created for 2 items
            </span>
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface-2 px-2 py-1 text-[10px] font-medium">
            <CircleCheck className="h-3 w-3 text-emerald-600" />
            Sent to supplier
          </div>
        </div>
      </div>
    </div>
  );
}
