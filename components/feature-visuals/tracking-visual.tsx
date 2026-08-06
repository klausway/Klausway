import { Navigation, Gauge, Truck } from "lucide-react";

const fleet = [
  {
    id: "TRK-12",
    driver: "M. Alvarez",
    speed: "46 mph",
    status: "En route",
    dotColor: "bg-lime-400",
    active: true,
  },
  {
    id: "VAN-07",
    driver: "D. Okafor",
    speed: "31 mph",
    status: "En route",
    dotColor: "bg-lime-400",
    active: false,
  },
  {
    id: "TRK-03",
    driver: "S. Reed",
    speed: "0 mph",
    status: "On site · 12 min",
    dotColor: "bg-amber-400",
    active: false,
  },
] as const;

export function TrackingVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-lime-500/10 to-emerald-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div>
            <div className="text-xs font-semibold">Live Fleet Map</div>
            <div className="mt-0.5 text-[10px] text-muted-foreground">
              3 vehicles · updated 4s ago
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-lime-500/10 px-2 py-0.5 text-[10px] font-medium text-lime-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-lime-400/60 animate-ping-soft" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-lime-400" />
            </span>
            Live GPS
          </div>
        </div>

        <div className="grid grid-cols-5">
          <div className="relative col-span-3 border-r border-border">
            <svg
              viewBox="0 0 300 260"
              className="h-full w-full"
              role="img"
              aria-label="Map showing live vehicle positions and route history"
            >
              {/* street grid */}
              <g className="stroke-border" strokeWidth="1">
                <line x1="0" y1="52" x2="300" y2="44" />
                <line x1="0" y1="118" x2="300" y2="126" />
                <line x1="0" y1="196" x2="300" y2="188" />
                <line x1="58" y1="0" x2="66" y2="260" />
                <line x1="148" y1="0" x2="142" y2="260" />
                <line x1="232" y1="0" x2="240" y2="260" />
              </g>
              {/* blocks */}
              <g className="fill-surface-2" opacity="0.6">
                <rect x="76" y="58" width="56" height="52" rx="4" />
                <rect x="160" y="134" width="62" height="46" rx="4" />
                <rect x="12" y="132" width="38" height="56" rx="4" />
                <rect x="248" y="54" width="40" height="60" rx="4" />
              </g>
              {/* path taken (history) */}
              <path
                d="M 24 236 L 62 232 L 66 122 L 145 126 L 148 48 L 236 44"
                fill="none"
                className="stroke-brand-400"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="1 6"
                opacity="0.7"
              />
              {/* remaining route */}
              <path
                d="M 236 44 L 268 42"
                fill="none"
                className="stroke-muted-foreground"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 4"
                opacity="0.4"
              />
              {/* start point */}
              <circle cx="24" cy="236" r="4" className="fill-brand-400" opacity="0.5" />
              {/* other vehicles */}
              <circle cx="145" cy="126" r="5" className="fill-amber-400" />
              <circle cx="64" cy="180" r="5" className="fill-lime-400" />
              {/* active vehicle */}
              <g>
                <circle cx="236" cy="44" r="12" className="fill-lime-400" opacity="0.25">
                  <animate
                    attributeName="r"
                    values="8;14;8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
                <circle cx="236" cy="44" r="7" className="fill-lime-500" />
                <path
                  d="M 236 40 L 239 47 L 236 45.5 L 233 47 Z"
                  fill="white"
                />
              </g>
            </svg>
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-md border border-border bg-card/90 px-1.5 py-0.5 text-[9px] text-muted-foreground backdrop-blur">
              <Navigation className="h-2.5 w-2.5" />
              Path taken · today 8:00–now
            </div>
          </div>

          <div className="col-span-2">
            {fleet.map((v) => (
              <div
                key={v.id}
                className={`border-b border-border p-3 ${
                  v.active ? "bg-surface-2" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[10px] font-semibold">{v.id}</span>
                  </div>
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${v.dotColor}`}
                  />
                </div>
                <div className="mt-1 text-[9px] text-muted-foreground">
                  {v.driver} · {v.status}
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-medium">
                  <Gauge className="h-2.5 w-2.5 text-muted-foreground" />
                  {v.speed}
                </div>
              </div>
            ))}
            <div className="p-3">
              <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                Speed report
              </div>
              <div className="mt-1.5 flex items-end gap-1">
                {[35, 48, 42, 55, 38, 46, 30].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm bg-gradient-to-t from-lime-500/60 to-emerald-400/60"
                    style={{ height: `${h * 0.5}px` }}
                  />
                ))}
              </div>
              <div className="mt-1 text-[9px] text-muted-foreground">
                Avg 42 mph · no violations
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
