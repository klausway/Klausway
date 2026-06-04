"use client";

import { useState, type FormEvent } from "react";
import { Reveal } from "./animation/reveal";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          message: data.get("message"),
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Failed to send message.");
      }

      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Reveal className="rounded-2xl border border-white/10 bg-card/40 p-6 backdrop-blur md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">Contact us</h2>

      {submitted ? (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Thank you — your message has been sent. We will get back to you at the
          email address you provided.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                First name
              </span>
              <input
                name="firstName"
                type="text"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Last name
              </span>
              <input
                name="lastName"
                type="text"
                required
                disabled={loading}
                className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              Email<span className="text-brand-300">*</span>
            </span>
            <input
              name="email"
              type="email"
              required
              disabled={loading}
              className="w-full rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              Message<span className="text-brand-300">*</span>
            </span>
            <textarea
              name="message"
              required
              rows={5}
              disabled={loading}
              className="w-full resize-y rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-black transition-all hover:bg-white/90 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : "Submit"}
          </button>
        </form>
      )}
    </Reveal>
  );
}
