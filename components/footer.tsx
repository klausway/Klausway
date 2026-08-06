import Link from "next/link";
import { Logo } from "./logo";
import { TrackedLink } from "./tracked-link";
import { footerLinks, routes } from "@/lib/navigation";
import { brand } from "@/lib/brand";

const cols = [
  { title: "Services", items: footerLinks.services },
  { title: "Solutions", items: footerLinks.solutions },
  { title: "Company", items: footerLinks.company },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink text-ink-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href={routes.home} className="inline-flex items-center gap-2">
              <Logo height={34} />
              <span className="font-display text-lg font-bold tracking-tight text-ink-foreground">
                Klaus Way
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-[#9CA1AF]">
              Custom software and IT consulting from North Windham, Connecticut.
              CRM, dispatch, payments, compliance, and AI — built and run by the
              people you talk to.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal" />
              <span className="text-xs text-[#9CA1AF]">
                Mon–Fri, 9:00–4:00 ET · replies within one business day
              </span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-signal">
                <span aria-hidden className="h-1.5 w-1.5 bg-signal" />
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#9CA1AF] transition-colors hover:text-ink-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="inline-flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-signal">
              <span aria-hidden className="h-1.5 w-1.5 bg-signal" />
              Contact
            </div>
            <ul className="mt-4 space-y-2.5">
              <li>
                <TrackedLink
                  href="mailto:support@klausway.com"
                  event="email_click"
                  eventParams={{ location: "footer" }}
                  className="text-sm text-[#9CA1AF] transition-colors hover:text-ink-foreground"
                >
                  support@klausway.com
                </TrackedLink>
              </li>
              <li>
                <TrackedLink
                  href="tel:+18604000758"
                  event="phone_click"
                  eventParams={{ location: "footer" }}
                  className="text-sm text-[#9CA1AF] transition-colors hover:text-ink-foreground"
                >
                  (860) 400-0758
                </TrackedLink>
              </li>
              <li>
                <a
                  href="https://maps.google.com/?q=29+Northridge+Drive+North+Windham+CT+06256"
                  className="text-sm text-[#9CA1AF] transition-colors hover:text-ink-foreground"
                >
                  29 Northridge Drive
                  <br />
                  North Windham, CT 06256
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <div className="text-xs text-[#9CA1AF]">
            © 2026 {brand.name} · {brand.tagline}
          </div>
          <div className="flex items-center gap-5 text-xs text-[#9CA1AF]">
            <Link href={routes.privacyPolicy} className="hover:text-ink-foreground">
              Privacy Policy
            </Link>
            <Link href={routes.termsOfService} className="hover:text-ink-foreground">
              Terms of Service
            </Link>
            <Link
              href={`${routes.privacyPolicy}#cookie-notice`}
              className="hover:text-ink-foreground"
            >
              Cookies
            </Link>
            <a
              href="mailto:support@klausway.com?subject=Data%20Processing%20Addendum"
              className="hover:text-ink-foreground"
            >
              DPA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
