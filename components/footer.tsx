import Link from "next/link";
import { Logo } from "./logo";
import { footerLinks, routes } from "@/lib/navigation";
import { brand } from "@/lib/brand";

const cols = [
  { title: "Services", items: footerLinks.services },
  { title: "Solutions", items: footerLinks.solutions },
  { title: "Company", items: footerLinks.company },
  { title: "Contact", items: footerLinks.contact },
];

export function Footer() {
  return (
    <footer className="border-t border-black/[0.08] bg-background/80">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href={routes.home} className="inline-flex">
              <Logo height={36} />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Strategic IT solutions for long-term business growth. Custom apps,
              system integration, automation, and cloud — built for how you work.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {["X", "Fb", "IG", "YT", "Li"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-black/[0.08] bg-black/[0.03] text-xs text-muted-foreground transition-colors hover:bg-black/[0.06] hover:text-foreground"
                >
                  {s}
                </a>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-2 rounded-lg border border-black/[0.08] bg-card/40 px-3 py-2">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
              <span className="text-xs text-muted-foreground">
                24/7 support available
              </span>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <div className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-black/[0.08] pt-8 md:flex-row md:items-center">
          <div className="text-xs text-muted-foreground">
            © 2026 {brand.name} · {brand.tagline}
          </div>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="hover:text-foreground">
              Cookies
            </a>
            <a href="#" className="hover:text-foreground">
              DPA
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
