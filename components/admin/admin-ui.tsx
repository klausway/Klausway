"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatusBadge({
  published,
}: {
  published: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        published
          ? "bg-lime-400/15 text-lime-300"
          : "bg-amber-400/15 text-amber-200",
      )}
    >
      {published ? "Published" : "Draft"}
    </span>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-16 text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "error";
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur",
        type === "error"
          ? "border-red-400/30 bg-red-500/10 text-red-100"
          : "border-brand-400/30 bg-brand-500/10 text-brand-800",
      )}
    >
      <p className="flex-1 text-sm">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="text-xs opacity-70 hover:opacity-100"
      >
        Dismiss
      </button>
    </div>
  );
}

export function FieldGroup({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
      <div className="mb-4">
        <h4 className="text-sm font-semibold">{title}</h4>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export function AdminField({
  label,
  hint,
  value,
  onChange,
  type = "text",
  required = true,
  placeholder,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {hint ? <span className="mb-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        minLength={type === "password" ? 8 : undefined}
        className="w-full rounded-xl border border-black/10 bg-background/80 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20"
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  hint,
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium">{label}</span> : null}
      {hint ? <span className="mb-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-y rounded-xl border border-black/10 bg-background/80 px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/20"
      />
    </label>
  );
}

export function PublishToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-black/10 bg-black/[0.03] px-4 py-3">
      <div>
        <p className="text-sm font-medium">Publish on website</p>
        <p className="text-xs text-muted-foreground">
          When enabled, this item appears on the public site
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 transition-colors",
          checked ? "bg-lime-500" : "bg-black/15",
        )}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-foreground shadow-sm transition-transform duration-200 ease-in-out",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </label>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" && "bg-foreground text-background hover:bg-foreground/90",
        variant === "secondary" && "border border-black/10 bg-black/[0.03] hover:bg-black/[0.06]",
        variant === "danger" && "border border-red-400/20 bg-red-500/10 text-red-200 hover:bg-red-500/20",
        variant === "ghost" && "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
