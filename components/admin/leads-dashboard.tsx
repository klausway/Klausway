"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/lib/api-path";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string | null;
  intent: string | null;
  status: "NEW" | "CONTACTED" | "CLOSED";
  createdAt: string;
};

const statusStyles: Record<Lead["status"], string> = {
  NEW: "bg-brand-500/15 text-brand-700",
  CONTACTED: "bg-amber-500/15 text-amber-700",
  CLOSED: "bg-surface-2 text-muted-foreground",
};

const nextStatus: Record<Lead["status"], Lead["status"]> = {
  NEW: "CONTACTED",
  CONTACTED: "CLOSED",
  CLOSED: "NEW",
};

export function LeadsDashboard() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(sessionStorage.getItem("cms_token"));
    setChecked(true);
  }, []);

  const load = useCallback(async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/admin/leads"), {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.status === 401) {
        setToken(null);
        return;
      }
      if (!res.ok) throw new Error("Failed to load leads.");
      setLeads((await res.json()) as Lead[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) void load(token);
  }, [token, load]);

  async function cycleStatus(lead: Lead) {
    if (!token) return;
    const status = nextStatus[lead.status];
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status } : l)),
    );
    const res = await fetch(apiUrl(`/api/admin/leads/${lead.id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, status: lead.status } : l)),
      );
    }
  }

  if (!checked) return null;

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Leads</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You need to sign in to the CMS first.
        </p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
        >
          Go to admin sign-in
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">Leads</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact form submissions, newest first. Click a status to advance it.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin" className="text-sm text-brand-600 hover:text-brand-700">
            ← CMS
          </Link>
          <button
            onClick={() => token && load(token)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm hover:bg-surface-2"
          >
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {loading && leads.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : null}
      {!loading && leads.length === 0 && !error ? (
        <p className="mt-6 text-sm text-muted-foreground">No leads yet.</p>
      ) : null}

      <div className="mt-8 space-y-4">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-semibold">{lead.name}</span>
                <a
                  href={`mailto:${lead.email}`}
                  className="text-sm text-brand-600 hover:text-brand-700"
                >
                  {lead.email}
                </a>
                {lead.phone ? (
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {lead.phone}
                  </a>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                {lead.intent ? (
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {lead.intent}
                  </span>
                ) : null}
                {lead.source ? (
                  <span className="rounded-full bg-surface-2 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {lead.source}
                  </span>
                ) : null}
                <button
                  onClick={() => cycleStatus(lead)}
                  className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${statusStyles[lead.status]}`}
                  title="Click to advance status"
                >
                  {lead.status}
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
              {lead.message}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Date(lead.createdAt).toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
