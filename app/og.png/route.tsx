import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** Default 1200×630 OG image — referenced by siteConfig.defaultOgImage. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 96px",
          background: "#0C0F1A",
          color: "#F5F6F1",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 26,
            letterSpacing: 6,
            color: "#A3E635",
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 14, height: 14, background: "#A3E635" }} />
          Klaus Way
        </div>
        <div
          style={{
            marginTop: 40,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          Software built around how your business actually runs
        </div>
        <div
          style={{
            marginTop: 36,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 220, height: 8, background: "#A3E635" }} />
          <div style={{ fontSize: 28, color: "#9CA1AF" }}>
            Custom software · North Windham, CT
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
