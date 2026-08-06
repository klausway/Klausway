"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, CircleCheck, Phone } from "lucide-react";
import { Reveal } from "./animation/reveal";
import { useRecaptchaV3 } from "@/hooks/use-recaptcha-v3";
import { apiUrl } from "@/lib/api-path";
import { trackEvent } from "@/lib/analytics";
import { getFeaturedProduct } from "@/lib/featured-products";
import { routes } from "@/lib/navigation";

const IS_STATIC_EXPORT = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK;

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-brand-400 focus:ring-1 focus:ring-brand-400/40 disabled:opacity-60";

const intentOptions = [
  { value: "", label: "What do you need? (optional)" },
  { value: "custom", label: "Custom software for my business" },
  { value: "demo", label: "A demo of one of your products" },
  { value: "consult", label: "IT consulting" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  return (
    <Suspense fallback={<ContactFormInner />}>
      <ContactFormWithParams />
    </Suspense>
  );
}

function ContactFormWithParams() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product") ?? undefined;
  const intent = searchParams.get("intent") ?? undefined;
  return <ContactFormInner productId={productId} initialIntent={intent} />;
}

type ContactFormInnerProps = {
  productId?: string;
  initialIntent?: string;
};

function ContactFormInner({ productId, initialIntent }: ContactFormInnerProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formStartedAt, setFormStartedAt] = useState<number>(() => Date.now());
  const { enabled, ready, loadError, getToken } = useRecaptchaV3();

  const product = productId ? getFeaturedProduct(productId) : undefined;
  const source = product ? `product:${product.id}` : "contact";
  const defaultIntent =
    initialIntent && intentOptions.some((o) => o.value === initialIntent)
      ? initialIntent
      : product
        ? "demo"
        : "";
  const defaultMessage = product ? `I'd like a demo of ${product.name}.` : "";

  useEffect(() => {
    setFormStartedAt(Date.now());
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const intent = String(data.get("intent") ?? "");

    // Static export has no API — hand off to the visitor's mail client instead.
    if (IS_STATIC_EXPORT) {
      const subject = product
        ? `Demo request: ${product.name} — ${name}`
        : `Website inquiry — ${name}`;
      const bodyLines = [
        `Name: ${name}`,
        `Phone: ${String(data.get("phone") ?? "") || "—"}`,
        "",
        String(data.get("message") ?? ""),
      ];
      window.location.href = `mailto:support@klausway.com?subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
      setSubmittedName(name.split(" ")[0] ?? "");
      setSubmitted(true);
      trackEvent("generate_lead", { source, intent, mode: "mailto" });
      setLoading(false);
      return;
    }

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
          name,
          email: data.get("email"),
          phone: data.get("phone"),
          message: data.get("message"),
          intent,
          source,
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

      setSubmittedName(name.split(" ")[0] ?? "");
      setSubmitted(true);
      trackEvent("generate_lead", { source, intent });
      form.reset();
      setFormStartedAt(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Reveal className="rounded-2xl border border-border bg-card p-6 shadow-card md:p-8">
      <h2 className="font-display text-2xl font-bold tracking-tight">
        {product ? `Request a ${product.name} demo` : "Contact us"}
      </h2>
      {product ? (
        <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-3 py-1 font-mono text-[11px] text-muted-foreground">
          <span className="h-1.5 w-1.5 bg-signal" />
          About: {product.name}
        </p>
      ) : null}

      {submitted ? (
        <div className="mt-6">
          <p className="flex items-start gap-2 text-sm leading-relaxed">
            <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-signal-ink" />
            <span>
              Thanks{submittedName ? `, ${submittedName}` : ""} — we reply within
              one business day (Mon–Fri, 9:00–4:00 ET).
            </span>
          </p>
          <div className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
            <p className="text-muted-foreground">While you wait:</p>
            <a
              href="tel:+18604000758"
              onClick={() => trackEvent("phone_click", { location: "thank_you" })}
              className="flex items-center gap-2 font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              <Phone className="h-4 w-4" />
              Call us now — (860) 400-0758
            </a>
            <Link
              href={routes.products}
              className="flex items-center gap-2 font-medium text-brand-600 transition-colors hover:text-brand-700"
            >
              <ArrowRight className="h-4 w-4" />
              See the products we build and run
            </Link>
            {CAL_LINK ? (
              <a
                href={`https://cal.com/${CAL_LINK}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("cta_click", { location: "thank_you_booking" })}
                className="flex items-center gap-2 font-medium text-brand-600 transition-colors hover:text-brand-700"
              >
                <ArrowRight className="h-4 w-4" />
                Or book a time on our calendar now
              </a>
            ) : null}
          </div>
        </div>
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
                Name<span className="text-brand-600">*</span>
              </span>
              <input
                name="name"
                type="text"
                required
                maxLength={160}
                autoComplete="name"
                disabled={loading}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Email<span className="text-brand-600">*</span>
              </span>
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                disabled={loading}
                className={inputClass}
              />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                Phone <span className="text-xs">(optional)</span>
              </span>
              <input
                name="phone"
                type="tel"
                maxLength={40}
                autoComplete="tel"
                placeholder="(860) 400-0758"
                disabled={loading}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-muted-foreground">
                What do you need?
              </span>
              <select
                name="intent"
                defaultValue={defaultIntent}
                disabled={loading}
                className={inputClass}
              >
                {intentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
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
              defaultValue={defaultMessage}
              disabled={loading}
              className={`${inputClass} resize-y`}
            />
          </label>
          {error ? (
            <p className="text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading || (!IS_STATIC_EXPORT && enabled && !ready)}
            className="inline-flex rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send message"}
          </button>
          {enabled && !IS_STATIC_EXPORT ? (
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
