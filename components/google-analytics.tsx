import Script from "next/script";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-6KDFEV8EQK";
/** Google Ads conversion ID (AW-…). Override with NEXT_PUBLIC_GOOGLE_ADS_ID. */
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-809420228";

/**
 * Google Analytics 4 + Google Ads (gtag.js).
 * Defaults to the Klausway GA4 stream and Ads tag. Override with env vars.
 */
export function GoogleAnalytics() {
  if (!GA_ID && !ADS_ID) return null;

  const primaryId = GA_ID || ADS_ID;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${GA_ID ? `gtag('config', '${GA_ID}');` : ""}
          ${ADS_ID ? `gtag('config', '${ADS_ID}');` : ""}
        `}
      </Script>
    </>
  );
}
