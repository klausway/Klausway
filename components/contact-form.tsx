"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Reveal } from "./animation/reveal";
import { useRecaptchaV3 } from "@/hooks/use-recaptcha-v3";
import { apiUrl } from "@/lib/api-path";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStartedAt, setFormStartedAt] = useState<number>(() => Date.now());
  const { enabled, ready, loadError, getToken } = useRecaptchaV3();

  useEffect(() => {
    setFormStartedAt(Date.now());
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      if (loadError) {
        throw new Error(loadError);
      }
      if (enabled && !ready) {
        throw new Error("Bot protection is still loading. Please wait a moment.");
      }

      const recaptchaToken = await getToken();

      const response = await fetch(apiUrl("/api/contact"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: data.get("firstName"),
          lastName: data.get("lastName"),
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          // Honeypot — leave empty; bots often autofill it
          hpField: data.get("hpField"),
          formStartedAt,
          recaptchaToken,
        }),
      });

      if (response.status === 429) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(
          payload.error ?? "Too many messages. Please try again later.",
        );
      }

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Failed to send message.");
      }

      setSubmitted(true);
      form.reset();
      setFormStartedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Reveal className="rounded-2xl border border-black/10 bg-card/40 p-6 backdrop-blur md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">Contact us</h2>

      {submitted ? (
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          Thank you — your message has been sent. We will get back to you at the
          email address you provided.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="relative mt-6 space-y-4">
          {/* Honeypot — obscure name to avoid browser autofill */}
          <div
            className="pointer-events-none absolute -left-[9999px] top-0 h-px w-px overflow-hidden opacity-0"
            aria-hidden="true"
          >
            <label>
              Leave blank
              <input
                name="hpField"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                First name
              </span>
              <input
                name="firstName"
                type="text"
                required
                maxLength={80}
                disabled={loading}
                className="w-full rounded-xl border border-black/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
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
                maxLength={80}
                disabled={loading}
                className="w-full rounded-xl border border-black/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Email<span className="text-brand-600">*</span>
              </span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                disabled={loading}
                className="w-full rounded-xl border border-black/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Phone<span className="text-brand-600">*</span>
              </span>
              <input
                name="phone"
                type="tel"
                required
                maxLength={40}
                autoComplete="tel"
                placeholder="(860) 400-0758"
                disabled={loading}
                className="w-full rounded-xl border border-black/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
              />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted-foreground">
              Message<span className="text-brand-600">*</span>
            </span>
            <textarea
              name="message"
              required
              rows={5}
              maxLength={5000}
              minLength={10}
              disabled={loading}
              className="w-full resize-y rounded-xl border border-black/10 bg-background/60 px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400/50 focus:ring-1 focus:ring-brand-400/30 disabled:opacity-60"
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading || (enabled && !ready)}
            className="inline-flex rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-all hover:bg-foreground/90 hover:shadow-lg hover:shadow-brand-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : "Submit"}
          </button>
          {enabled ? (
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              This site is protected by reCAPTCHA and the Google{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Privacy Policy
              </a>{" "}
              and{" "}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-foreground"
              >
                Terms of Service
              </a>{" "}
              apply.
            </p>
          ) : null}
        </form>
      )}
    </Reveal>
  );
}
