export type AnalyticsEvent =
  | "generate_lead"
  | "cta_click"
  | "demo_request"
  | "phone_click"
  | "email_click"
  | "vapi_open"
  | "calendar_book";

type Gtag = (command: "event", name: string, params?: Record<string, string>) => void;

/** Fire a GA4 event. No-ops when gtag isn't loaded (GA disabled or SSR). */
export function trackEvent(name: AnalyticsEvent, params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}
