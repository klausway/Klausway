"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  ExternalLink,
  Menu,
  Phone,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { getProductNavChildren } from "@/lib/featured-products";
import {
  navItems,
  routes,
  type NavChild,
  type NavItem,
} from "@/lib/navigation";
import { trackEvent } from "@/lib/analytics";

function buildNavItems(): NavItem[] {
  const productChildren = getProductNavChildren();
  return navItems.map((item) =>
    item.label === "Products" ? { ...item, children: productChildren } : item,
  );
}

function NavChildLink({
  child,
  className,
  onNavigate,
}: {
  child: NavChild;
  className?: string;
  onNavigate?: () => void;
}) {
  if (child.external) {
    return (
      <a
        href={child.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          trackEvent("cta_click", {
            location: "navbar_products",
            product: child.label,
          });
          onNavigate?.();
        }}
        className={className}
      >
        <span>{child.label}</span>
        <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-60" />
      </a>
    );
  }

  return (
    <Link href={child.href} onClick={onNavigate} className={className}>
      {child.label}
    </Link>
  );
}

function ProductsDropdown({
  item,
  active,
}: {
  item: NavItem;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();
  const children = item.children ?? [];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-surface-2 hover:text-foreground",
          active
            ? "font-medium text-foreground after:absolute after:-bottom-0.5 after:left-3 after:h-0.5 after:w-3 after:bg-signal"
            : "text-muted-foreground",
        )}
      >
        {item.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-50 pt-2"
        >
          <div className="min-w-[14rem] overflow-hidden rounded-xl border border-border bg-background py-1.5 shadow-xl shadow-black/8">
            {children.map((child) => (
              <NavChildLink
                key={child.label}
                child={child}
                onNavigate={() => setOpen(false)}
                className={cn(
                  "flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                  child.label === "All products" &&
                    "border-b border-border font-medium text-foreground",
                )}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const items = buildNavItems();

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
    setMobileProductsOpen(false);
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
        <Link href={routes.home} className="flex shrink-0 items-center">
          <Logo
            height={34}
            showText
            textClassName="font-display text-lg font-bold tracking-tight whitespace-nowrap"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {items.map((item) =>
            item.children?.length ? (
              <ProductsDropdown
                key={item.label}
                item={item}
                active={isActive(item.href)}
              />
            ) : (
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
            ),
          )}
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <a
            href="tel:+18604000758"
            onClick={() => trackEvent("phone_click", { location: "navbar" })}
            className="hidden items-center gap-1.5 whitespace-nowrap text-sm text-muted-foreground transition-colors hover:text-foreground xl:inline-flex"
          >
            <Phone className="h-3.5 w-3.5" />
            (860) 400-0758
          </a>
          <Link
            href={routes.contact}
            onClick={() => trackEvent("cta_click", { location: "navbar" })}
            className="group inline-flex items-center gap-1.5 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
          >
            Get a free consult
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
            {items.map((item) =>
              item.children?.length ? (
                <div key={item.label} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setMobileProductsOpen((value) => !value)}
                    className={cn(
                      "flex items-center justify-between rounded-lg px-3 py-3 text-base hover:bg-surface-2 hover:text-foreground",
                      isActive(item.href)
                        ? "font-medium text-foreground"
                        : "text-muted-foreground",
                    )}
                    aria-expanded={mobileProductsOpen}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform",
                        mobileProductsOpen && "rotate-180",
                      )}
                    />
                  </button>
                  {mobileProductsOpen ? (
                    <div className="mb-1 ml-2 flex flex-col border-l border-border pl-2">
                      {item.children.map((child) => (
                        <NavChildLink
                          key={child.label}
                          child={child}
                          onNavigate={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                            child.label === "All products" &&
                              "font-medium text-foreground",
                          )}
                        />
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
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
              ),
            )}
            <div className="mt-2 flex flex-col gap-2 border-t border-border pt-4">
              <a
                href="tel:+18604000758"
                onClick={() =>
                  trackEvent("phone_click", { location: "navbar_mobile" })
                }
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-3 text-center text-sm text-foreground"
              >
                <Phone className="h-3.5 w-3.5" />
                (860) 400-0758
              </a>
              <Link
                href={routes.contact}
                onClick={() =>
                  trackEvent("cta_click", { location: "navbar_mobile" })
                }
                className="rounded-lg bg-foreground px-3 py-3 text-center text-sm font-medium text-background"
              >
                Get a free consult
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
