import Link from "next/link";
import { TrendingDown } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { AnimatedCounter } from "./animation/animated-counter";
import { routes } from "@/lib/navigation";

export function PricingCompare({ hideHeader = false }: { hideHeader?: boolean }) {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-brand-500/5 to-transparent" />
      <div className="mx-auto max-w-7xl px-6">
        {!hideHeader && (
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Portal access,
              <br />
              <span className="text-gradient-animated">built for how you work</span>
            </h2>
            <p className="mt-5 text-balance text-lg text-muted-foreground">
              Stop paying for disconnected tools. Access the full Klaus Way ecosystem
              <br />
              with modular plans — add only the apps your business needs.
            </p>
          </Reveal>
        )}

        <Reveal as="div" delay={100} className={`mx-auto max-w-5xl rounded-3xl border border-black/10 bg-card/50 p-1 backdrop-blur ${hideHeader ? "" : "mt-12"}`}>
          <div className="grid grid-cols-1 gap-1 rounded-[20px] md:grid-cols-2">
            <div className="rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-400">
                  Disconnected Tools
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground">
                  CRM + Automation + AI + Finance · Per tool
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold text-muted-foreground line-through decoration-rose-400/50 decoration-2 tabular-nums">
                    <AnimatedCounter to={2400} prefix="$" duration={1800} />
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  Plus integration costs, duplicate data entry, and siloed workflows
                </div>
              </div>

              <ul className="mt-8 space-y-2.5 text-sm text-muted-foreground">
                <CompareItem text="Separate logins for every tool" negative />
                <CompareItem text="Manual data sync between systems" negative />
                <CompareItem text="No unified client portal" negative />
                <CompareItem text="AI voice & automation sold separately" negative />
                <CompareItem text="Developer tools not included" negative />
              </ul>
            </div>

            <div className="relative rounded-2xl bg-gradient-to-br from-brand-500/10 via-fuchsia-500/5 to-transparent p-8 md:p-10 transition-all hover:from-brand-500/15 hover:via-fuchsia-500/10">
              <div className="absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-brand-400 to-transparent" />
              <div className="flex items-center justify-between">
                <div className="rounded-lg bg-lime-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-lime-600">
                  Klaus Way Portal
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-lime-500/10 px-2 py-0.5 text-[10px] font-semibold text-lime-600">
                  <TrendingDown className="h-3 w-3" />
                  All connected
                </div>
              </div>
              <div className="mt-6">
                <div className="text-xs text-muted-foreground">
                  Full ecosystem · Single sign-on
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold text-gradient-animated tabular-nums">
                    <AnimatedCounter to={299} prefix="$" duration={1600} />
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
                <div className="mt-3 text-xs text-muted-foreground">
                  9 apps. One portal. Workflows that talk to each other.
                </div>
              </div>

              <ul className="mt-8 space-y-2.5 text-sm">
                <CompareItem text="Single sign-on across all 9 apps" />
                <CompareItem text="Klaus Connect CRM included" />
                <CompareItem text="n8n automation & Voice AI ready" />
                <CompareItem text="Customer portal & finance tools" />
                <CompareItem text="FileMaker & MailAgent developer utilities" />
              </ul>

              <Link
                href={routes.pricing}
                className="group/cta mt-8 flex items-center justify-center gap-1.5 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/20"
              >
                Request portal access
                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </Reveal>

        <PricingPlans />
      </div>
    </section>
  );
}

function CompareItem({
  text,
  negative,
}: {
  text: string;
  negative?: boolean;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <span
        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
          negative
            ? "bg-rose-500/20 text-rose-400"
            : "bg-lime-500/20 text-lime-600"
        }`}
      >
        {negative ? (
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
      <span className={negative ? "text-muted-foreground" : "text-foreground"}>
        {text}
      </span>
    </li>
  );
}

function PricingPlans() {
  const plans = [
    {
      name: "Core",
      price: "99",
      desc: "CRM & client-facing essentials",
      features: [
        "Klaus Connect CRM",
        "Klaus Customer Portal",
        "Admin & Reports (basic)",
        "Single sign-on access",
        "Email support",
      ],
      cta: "Get started",
      highlight: false,
    },
    {
      name: "Automation",
      price: "199",
      desc: "AI, workflows & developer tools",
      features: [
        "Everything in Core",
        "CRM Intelligence & AI Call",
        "n8n Console",
        "MailAgent",
        "FileMaker Analyzer & Tester",
        "Priority support",
      ],
      cta: "Request access",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Full ecosystem + field & finance",
      features: [
        "All 9 portal apps",
        "Spendledger & QuickBooks Payment",
        "KLR & Roof Estimator field apps",
        "Custom integrations & SSO",
        "Dedicated success manager",
        "On-premise option",
      ],
      cta: "Contact sales",
      highlight: false,
    },
  ];

  return (
    <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3">
      {plans.map((plan, i) => (
        <Reveal
          key={plan.name}
          delay={(i * 100) as 0 | 100 | 200 | 300 | 400}
          className={`hover-lift relative rounded-2xl border p-7 transition-colors hover:border-black/15 ${
            plan.highlight
              ? "border-brand-400/40 bg-gradient-to-b from-brand-500/10 to-transparent shadow-xl shadow-brand-500/10 hover:shadow-2xl hover:shadow-brand-500/20"
              : "border-black/[0.08] bg-card/40 hover:bg-card/60"
          }`}
        >
          {plan.highlight && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-fuchsia-500 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Most popular
            </div>
          )}
          <div className="text-sm font-semibold">{plan.name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{plan.desc}</div>
          <div className="mt-5 flex items-baseline gap-1">
            {plan.price === "Custom" ? (
              <span className="text-3xl font-semibold">{"Let's talk"}</span>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">$</span>
                <span className="text-4xl font-semibold tracking-tight">
                  {plan.price}
                </span>
                <span className="text-sm text-muted-foreground">/month</span>
              </>
            )}
          </div>
          <Link
            href={routes.contact}
            className={`mt-6 block rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-all ${
              plan.highlight
                ? "bg-foreground text-background hover:shadow-lg hover:shadow-brand-500/20"
                : "border border-black/10 bg-black/[0.03] text-foreground hover:bg-black/[0.06]"
            }`}
          >
            {plan.cta}
          </Link>
          <ul className="mt-6 space-y-2.5 text-sm">
            {plan.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-muted-foreground"
              >
                <span className="mt-1 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand-500/20 text-brand-600">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-2 w-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </span>
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
