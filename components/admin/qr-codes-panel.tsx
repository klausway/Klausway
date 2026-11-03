"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Copy, Download, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminButton, AdminField, EmptyState } from "@/components/admin/admin-ui";
import { apiUrl } from "@/lib/api-path";
import { qrShortUrl } from "@/lib/qr";
import { cn } from "@/lib/utils";

type QrRecord = {
  id: string;
  slug: string;
  name: string;
  destination: string;
  active: boolean;
  scanCount: number;
  lastScannedAt: string | null;
  createdAt: string;
};

type QrDraft = {
  id?: string;
  slug: string;
  name: string;
  destination: string;
  active: boolean;
};

const emptyDraft = (): QrDraft => ({
  slug: "",
  name: "",
  destination: "/contact/?utm_source=qr&utm_medium=print&utm_campaign=",
  active: true,
});

const QR_OPTIONS = { margin: 2, errorCorrectionLevel: "M" as const };

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
}

async function downloadPng(slug: string) {
  const dataUrl = await QRCode.toDataURL(qrShortUrl(slug), { ...QR_OPTIONS, width: 1024 });
  triggerDownload(dataUrl, `klausway-qr-${slug}.png`);
}

async function downloadSvg(slug: string) {
  const svg = await QRCode.toString(qrShortUrl(slug), { ...QR_OPTIONS, type: "svg" });
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  triggerDownload(url, `klausway-qr-${slug}.svg`);
  URL.revokeObjectURL(url);
}

function QrPreview({ slug, className }: { slug: string; className?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setSrc(null);
      return;
    }
    let cancelled = false;
    void QRCode.toDataURL(qrShortUrl(slug), { ...QR_OPTIONS, width: 320 }).then((url) => {
      if (!cancelled) setSrc(url);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <div
      className={cn(
        "flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-black/10 bg-white",
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={`QR code for ${qrShortUrl(slug)}`} className="h-full w-full" />
      ) : (
        <span className="px-3 text-center text-xs text-muted-foreground">Enter a slug</span>
      )}
    </div>
  );
}

export function QrCodesPanel({
  token,
  notify,
}: {
  token: string;
  notify: (message: string, type?: "info" | "error") => void;
}) {
  const [codes, setCodes] = useState<QrRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<QrDraft | null>(null);
  const notifyRef = useRef(notify);
  notifyRef.current = notify;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/admin/qr"), { headers: authHeaders(token) });
      if (!res.ok) throw new Error("Failed to load QR codes.");
      setCodes((await res.json()) as QrRecord[]);
    } catch (error) {
      notifyRef.current(
        error instanceof Error ? error.message : "Failed to load QR codes.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const res = await fetch(
      apiUrl(draft.id ? `/api/admin/qr/${draft.id}` : "/api/admin/qr"),
      {
        method: draft.id ? "PUT" : "POST",
        headers: authHeaders(token),
        body: JSON.stringify(draft),
      },
    );
    const payload = (await res.json()) as { error?: string };
    if (!res.ok) {
      notify(payload.error ?? "Failed to save QR code.", "error");
      return;
    }
    setDraft(null);
    notify("QR code saved.");
    await load();
  }

  async function remove(code: QrRecord) {
    if (!confirm(`Delete QR code "${code.slug}"? Printed copies will send people to the home page.`)) {
      return;
    }
    const res = await fetch(apiUrl(`/api/admin/qr/${code.id}`), {
      method: "DELETE",
      headers: authHeaders(token),
    });
    if (!res.ok) {
      notify("Failed to delete QR code.", "error");
      return;
    }
    notify("QR code deleted.");
    await load();
  }

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(qrShortUrl(slug));
    notify("Short link copied.");
  }

  const editingExisting = Boolean(draft?.id);
  const originalSlug = codes.find((c) => c.id === draft?.id)?.slug;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">QR Codes</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Dynamic QR codes — the printed code stays the same, change where it goes any time.
          </p>
        </div>
        {!draft ? (
          <AdminButton onClick={() => setDraft(emptyDraft())}>
            <Plus className="h-4 w-4" />
            New QR code
          </AdminButton>
        ) : null}
      </div>

      {draft ? (
        <form
          onSubmit={save}
          className="grid gap-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5 md:grid-cols-[minmax(0,1fr)_220px]"
        >
          <div className="space-y-4">
            <AdminField
              label="Name"
              hint="Internal label, e.g. Trade show flyer"
              value={draft.name}
              onChange={(v) => setDraft({ ...draft, name: v })}
            />
            <AdminField
              label="Slug"
              hint={`Short link: ${qrShortUrl(draft.slug || "your-slug")}`}
              value={draft.slug}
              onChange={(v) => setDraft({ ...draft, slug: v.toLowerCase() })}
              placeholder="contact"
            />
            {editingExisting && originalSlug && draft.slug !== originalSlug ? (
              <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-800">
                Changing the slug changes the QR image. Codes already printed with
                “{originalSlug}” will stop working.
              </p>
            ) : null}
            <AdminField
              label="Destination"
              hint="Site path like /contact/?utm_source=qr… or a full https:// URL"
              value={draft.destination}
              onChange={(v) => setDraft({ ...draft, destination: v })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                className="accent-brand-600"
              />
              Active — when off, scans go to the home page
            </label>
            <div className="flex gap-3">
              <AdminButton type="submit">Save QR code</AdminButton>
              <AdminButton type="button" variant="secondary" onClick={() => setDraft(null)}>
                Cancel
              </AdminButton>
            </div>
          </div>
          <QrPreview slug={draft.slug} />
        </form>
      ) : null}

      {loading && codes.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading QR codes…</p>
      ) : null}

      {!loading && codes.length === 0 && !draft ? (
        <EmptyState
          title="No QR codes yet"
          description="Create a QR code, download it for print, and change its destination later without reprinting."
          action={
            <AdminButton onClick={() => setDraft(emptyDraft())}>
              <Plus className="h-4 w-4" />
              New QR code
            </AdminButton>
          }
        />
      ) : null}

      <ul className="space-y-3">
        {codes.map((code) => (
          <li
            key={code.id}
            className="flex flex-col gap-4 rounded-2xl border border-black/10 bg-card/40 p-4 sm:flex-row sm:items-center"
          >
            <QrPreview slug={code.slug} className="w-28 shrink-0" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium">{code.name}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                    code.active
                      ? "bg-lime-500/15 text-lime-700"
                      : "bg-black/[0.05] text-muted-foreground",
                  )}
                >
                  {code.active ? "Active" : "Paused"}
                </span>
              </div>
              <p className="truncate font-mono text-xs text-brand-700">{qrShortUrl(code.slug)}</p>
              <p className="truncate text-xs text-muted-foreground">→ {code.destination}</p>
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold tabular-nums text-foreground">{code.scanCount}</span>{" "}
                scans
                {code.lastScannedAt
                  ? ` · last ${new Date(code.lastScannedAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <AdminButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => void downloadPng(code.slug)}>
                <Download className="h-3.5 w-3.5" />
                PNG
              </AdminButton>
              <AdminButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => void downloadSvg(code.slug)}>
                <Download className="h-3.5 w-3.5" />
                SVG
              </AdminButton>
              <AdminButton variant="secondary" className="px-3 py-2 text-xs" onClick={() => void copyLink(code.slug)}>
                <Copy className="h-3.5 w-3.5" />
                Link
              </AdminButton>
              <AdminButton
                variant="secondary"
                className="px-3 py-2 text-xs"
                onClick={() =>
                  setDraft({
                    id: code.id,
                    slug: code.slug,
                    name: code.name,
                    destination: code.destination,
                    active: code.active,
                  })
                }
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </AdminButton>
              <AdminButton variant="danger" className="px-2 py-2" onClick={() => void remove(code)}>
                <Trash2 className="h-3.5 w-3.5" />
              </AdminButton>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
