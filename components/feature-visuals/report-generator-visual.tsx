import { FileDown, History, LayoutTemplate, CircleCheck } from "lucide-react";

const pages = [
  { label: "Cover", active: false },
  { label: "Summary", active: true },
  { label: "Revenue", active: false },
  { label: "Appendix", active: false },
] as const;

const history = [
  { version: "v12", detail: "Generated 2h ago", latest: true },
  { version: "v11", detail: "Yesterday 4:18 PM", latest: false },
] as const;

const miniBars = [38, 52, 44, 66, 58, 74] as const;

export function ReportGeneratorVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-brand-500/10 to-indigo-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-indigo-500 text-white">
              <LayoutTemplate className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Report Builder</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                Q3-Performance-Review · 4 pages
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1 rounded-md bg-foreground px-2 py-1 text-[10px] font-medium text-background">
              <FileDown className="h-3 w-3" />
              Export PDF
            </button>
            <button className="rounded-md border border-border bg-surface-2 px-2 py-1 text-[10px]">
              XLSX
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5">
          {/* page rail */}
          <div className="col-span-1 space-y-2 border-r border-border p-3">
            {pages.map((page, i) => (
              <div key={page.label}>
                <div
                  className={`rounded-md border p-1.5 ${
                    page.active
                      ? "border-brand-400/60 bg-brand-500/10"
                      : "border-border bg-background/40"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="h-1 w-3/4 rounded bg-surface-2" />
                    <div className="h-1 w-full rounded bg-surface-2" />
                    <div className="h-3 w-full rounded bg-surface-2" />
                  </div>
                </div>
                <div
                  className={`mt-1 text-center text-[8px] ${
                    page.active
                      ? "font-semibold text-brand-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {i + 1} · {page.label}
                </div>
              </div>
            ))}
          </div>

          {/* canvas */}
          <div className="col-span-4 p-4">
            <div className="rounded-lg border border-border bg-background/50 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="h-2 w-32 rounded bg-foreground/20" />
                <div className="h-1.5 w-14 rounded bg-surface-2" />
              </div>
              <div className="mt-1.5 h-1.5 w-24 rounded bg-surface-2" />

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border p-2.5">
                  <div className="h-1.5 w-16 rounded bg-surface-2" />
                  <div className="mt-2 flex h-14 items-end gap-1.5">
                    {miniBars.map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-[3px] bg-gradient-to-t from-brand-500 to-indigo-400"
                        style={{ height: `${h}%`, opacity: 0.75 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="rounded-md border border-border p-2.5">
                  <div className="h-1.5 w-16 rounded bg-surface-2" />
                  <div className="mt-2.5 space-y-2">
                    {[100, 78, 55, 34].map((w, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="h-1 w-8 rounded bg-surface-2" />
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
                          <div
                            className="h-full rounded-full bg-brand-400/70"
                            style={{ width: `${w}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-md border border-border">
                {[0, 1, 2].map((row) => (
                  <div
                    key={row}
                    className={`grid grid-cols-4 gap-2 p-1.5 ${
                      row > 0 ? "border-t border-border" : "bg-surface-2/60"
                    }`}
                  >
                    {[0, 1, 2, 3].map((cell) => (
                      <div
                        key={cell}
                        className={`h-1 rounded ${
                          row === 0 ? "bg-foreground/20" : "bg-surface-2"
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border p-3">
          <div className="flex items-center gap-3">
            {history.map((h) => (
              <div
                key={h.version}
                className="flex items-center gap-1.5 text-[10px] text-muted-foreground"
              >
                <History className="h-3 w-3" />
                <span className="font-medium text-foreground">{h.version}</span>
                {h.detail}
                {h.latest && (
                  <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-medium text-emerald-600">
                    Latest
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <CircleCheck className="h-3 w-3 text-emerald-600" />
            Saved to history
          </div>
        </div>
      </div>
    </div>
  );
}
