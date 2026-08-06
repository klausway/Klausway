import { FileText, CircleCheck, Send, Eye, PenLine } from "lucide-react";

const steps = [
  {
    icon: <Send className="h-3 w-3" />,
    label: "Sent to customer",
    detail: "Emailed · Mon 9:14 AM",
    done: true,
  },
  {
    icon: <Eye className="h-3 w-3" />,
    label: "Viewed",
    detail: "Opened · Mon 11:02 AM",
    done: true,
  },
  {
    icon: <PenLine className="h-3 w-3" />,
    label: "Signed",
    detail: "Awaiting signature",
    done: false,
  },
] as const;

export function EsignVisual() {
  return (
    <div className="relative">
      <div className="absolute -inset-x-4 -inset-y-2 -z-10 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 blur-2xl" />
      <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur">
        <div className="flex items-center justify-between border-b border-border p-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
              <FileText className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Service-Agreement.pdf</div>
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                Sent from your custom application
              </div>
            </div>
          </div>
          <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
            Awaiting signature
          </span>
        </div>

        <div className="grid grid-cols-5">
          <div className="col-span-3 border-r border-border p-4">
            <div className="rounded-lg border border-border bg-background/50 p-4">
              {/* document body */}
              <div className="space-y-1.5">
                <div className="h-1.5 w-3/4 rounded bg-surface-2" />
                <div className="h-1.5 w-full rounded bg-surface-2" />
                <div className="h-1.5 w-5/6 rounded bg-surface-2" />
                <div className="h-1.5 w-full rounded bg-surface-2" />
                <div className="h-1.5 w-2/3 rounded bg-surface-2" />
              </div>
              <div className="mt-4 space-y-1.5">
                <div className="h-1.5 w-full rounded bg-surface-2" />
                <div className="h-1.5 w-4/5 rounded bg-surface-2" />
              </div>

              {/* signature field */}
              <div className="mt-5 rounded-lg border border-dashed border-brand-400/40 bg-brand-500/5 p-3">
                <div className="text-[9px] font-semibold uppercase tracking-wider text-brand-600">
                  Sign here
                </div>
                <svg
                  viewBox="0 0 160 36"
                  className="mt-1 h-9 w-full max-w-[160px]"
                  aria-hidden="true"
                >
                  <path
                    d="M 8 26 C 20 8, 30 8, 34 22 C 37 32, 44 30, 50 18 C 56 8, 62 10, 64 20 C 66 28, 74 28, 84 20 C 94 13, 108 12, 120 18 C 130 23, 142 21, 152 16"
                    fill="none"
                    className="stroke-foreground"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity="0.75"
                  />
                </svg>
                <div className="mt-1 border-t border-border pt-1 text-[9px] text-muted-foreground">
                  Customer signature · Date
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-2 flex flex-col p-4">
            <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              Signing progress
            </div>
            <div className="mt-3 space-y-4">
              {steps.map((step) => (
                <div key={step.label} className="flex items-start gap-2.5">
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      step.done
                        ? "bg-emerald-500/15 text-emerald-600"
                        : "border border-dashed border-border text-muted-foreground"
                    }`}
                  >
                    {step.done ? (
                      <CircleCheck className="h-3 w-3" />
                    ) : (
                      step.icon
                    )}
                  </div>
                  <div>
                    <div className="text-[11px] font-medium">{step.label}</div>
                    <div className="mt-0.5 text-[9px] text-muted-foreground">
                      {step.detail}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-lg border border-border bg-background/30 p-2.5 text-[9px] text-muted-foreground">
              <span className="font-medium text-foreground">
                2 of 3 requirements
              </span>{" "}
              met — completion blocked until all fields are signed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
