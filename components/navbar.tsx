"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { navItems, routes } from "@/lib/navigation";
import { trackEvent } from "@/lib/analytics";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    requestAnimationFrame(onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === routes.home) return pathname === routes.home;
    return pathname.startsWith(href.split("#")[0]);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border bg-background/75 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href={routes.home} className="flex items-center">
          <Logo height={34} showText textClassName="font-display text-lg font-bold tracking-tight" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "relative rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-2 hover:text-foreground",
                isActive(item.href)
                  ? "font-medium text-foreground after:absolute after:-bottom-0.5 after:left-3 after:h-0.5 after:w-3 after:bg-signal"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href="tel:+18604000758"
            onClick={() => trackEvent("phone_click", { location: "navbar" })}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-3.5 w-3.5" />
            (860) 400-0758
          </a>
          <Link
            href={routes.contact}
            onClick={() => trackEvent("cta_click", { location: "navbar" })}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Book a consultation
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg p-2 text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "block rounded-lg px-3 py-3 text-base hover:bg-surface-2 hover:text-foreground",
                  isActive(item.href)
                    ? "font-medium text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <a
                href="tel:+18604000758"
                onClick={() => trackEvent("phone_click", { location: "navbar_mobile" })}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-3 text-center text-sm text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                (860) 400-0758
              </a>
              <Link
                href={routes.contact}
                onClick={() => trackEvent("cta_click", { location: "navbar_mobile" })}
                className="rounded-lg bg-foreground px-3 py-3 text-center text-sm font-medium text-background"
              >
                Book a consultation
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
