"use client";

import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { AdminButton, AdminField } from "@/components/admin/admin-ui";
import { apiUrl } from "@/lib/api-path";
import type { AdminRole } from "@/lib/admin-roles";

type AdminUser = {
  id?: string;
  name: string;
  email: string;
  role: AdminRole;
};

type AdminAuthPanelProps = {
  onAuthenticated: (token: string, user: AdminUser) => void;
};

export function AdminAuthPanel({ onAuthenticated }: AdminAuthPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api/admin/auth"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const payload = (await response.json()) as {
        error?: string;
        token?: string;
        user?: AdminUser;
      };

      if (!response.ok || !payload.token || !payload.user) {
        throw new Error(payload.error ?? "Sign in failed");
      }

      onAuthenticated(payload.token, payload.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Content Studio</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your admin account. New accounts can only be created by
            an existing admin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/10 bg-black/[0.03] p-8 shadow-xl"
        >
          <AdminField
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@klausway.com"
          />
          <div className="mt-4">
            <AdminField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
            />
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <AdminButton type="submit" disabled={loading} className="mt-6 w-full">
            <Lock className="h-4 w-4" />
            {loading ? "Signing in…" : "Sign in"}
          </AdminButton>
        </form>
      </div>
    </div>
  );
}
