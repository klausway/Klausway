export type AnalyticsEvent =
  | "generate_lead"
  | "cta_click"
  | "demo_request"
  | "phone_click"
  | "email_click"
  | "vapi_open"
  | "calendar_book"
  | "conversion";

type Gtag = (
  command: "event" | "config" | "js" | "set",
  name: string | Date,
  params?: Record<string, string | number | boolean>,
) => void;

/** Klaus Way lead-form conversion (Google Ads). Override with NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL. */
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-809420228";
const ADS_LEAD_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_LEAD_LABEL || "995iCK_Z37kdEMSL-4ED";

/** Fire a GA4 event. No-ops when gtag isn't loaded (GA disabled or SSR). */
export function trackEvent(
  name: AnalyticsEvent,
  params?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", name, params);
}

/** Fire the Google Ads lead conversion for Klaus Way contact form submits. */
export function trackAdsLeadConversion() {
  if (typeof window === "undefined" || !ADS_ID || !ADS_LEAD_LABEL) return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== "function") return;
  gtag("event", "conversion", {
    send_to: `${ADS_ID}/${ADS_LEAD_LABEL}`,
  });
}
