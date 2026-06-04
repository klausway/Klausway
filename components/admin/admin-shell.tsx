"use client";

import {
  Briefcase,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminRole } from "@/lib/admin-roles";

export type AdminSection =
  | "overview"
  | "blog"
  | "portfolio"
  | "users"
  | "account";

const allNavItems: {
  id: AdminSection;
  label: string;
  description: string;
  icon: typeof FileText;
  roles: AdminRole[] | "all";
}[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Stats & shortcuts",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    id: "blog",
    label: "Blog",
    description: "Posts & articles",
    icon: FileText,
    roles: "all",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    description: "Projects & case studies",
    icon: Briefcase,
    roles: "all",
  },
  {
    id: "users",
    label: "Team",
    description: "Roles & accounts",
    icon: Users,
    roles: ["admin"],
  },
  {
    id: "account",
    label: "Account",
    description: "Change your password",
    icon: KeyRound,
    roles: "all",
  },
];

export function navItemsForRole(role: AdminRole) {
  return allNavItems.filter(
    (item) =>
      item.roles === "all" ||
      (Array.isArray(item.roles) && item.roles.includes(role)),
  );
}

type AdminShellProps = {
  section: AdminSection;
  onSectionChange: (section: AdminSection) => void;
  userRole: AdminRole;
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  children: React.ReactNode;
};

export function AdminShell({
  section,
  onSectionChange,
  userRole,
  userName,
  userEmail,
  onLogout,
  children,
}: AdminShellProps) {
  const navItems = navItemsForRole(userRole);
  const roleLabel = userRole === "admin" ? "Admin" : "Content";

  return (
    <div className="mx-auto flex min-h-screen max-w-[1800px]">
      <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[#0a0a14] p-6 lg:flex">
        <div className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-300">
            Klaus Way
          </p>
          <h1 className="mt-2 text-xl font-semibold tracking-tight">Content Studio</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage what visitors see on the website
          </p>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = section === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                  active
                    ? "bg-brand-500/15 text-brand-100 ring-1 ring-brand-400/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active && "text-brand-300")} />
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="block text-[11px] opacity-70">{item.description}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="truncate text-sm font-medium">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-brand-300/80">
            {roleLabel}
          </p>
          <button
            type="button"
            onClick={onLogout}
            className="mt-3 inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#07070f]/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-xs font-semibold uppercase tracking-wider text-brand-300">
              Content Studio
            </p>
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-medium",
                  section === item.id
                    ? "bg-brand-500/15 text-brand-200"
                    : "bg-white/5 text-muted-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={onLogout}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1 text-xs"
            >
              <LogOut className="h-3.5 w-3.5" />
              Out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
