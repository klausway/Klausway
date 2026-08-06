"use client";

import { useEffect, useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK;

/**
 * Cal.com inline booking embed. Renders nothing until NEXT_PUBLIC_CAL_LINK is
 * set (e.g. "klausway/intro-call"). Pure client — works on static export.
 */
export function BookingEmbed({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!CAL_LINK || !containerRef.current) return;
    setVisible(true);

    const namespace = "klausway-booking";
    const w = window as unknown as {
      Cal?: ((...args: unknown[]) => void) & { loaded?: boolean; ns?: Record<string, unknown> };
    };

    // Official Cal.com embed snippet (queue-based loader), namespaced.
    if (!w.Cal) {
      const queue: unknown[] = [];
      const cal = Object.assign(
        (...args: unknown[]) => {
          queue.push(args);
        },
        { q: queue, ns: {} as Record<string, unknown> },
      );
      w.Cal = cal;
      const script = document.createElement("script");
      script.src = "https://app.cal.com/embed/embed.js";
      script.async = true;
      document.head.appendChild(script);
    }

    const Cal = w.Cal!;
    Cal("init", namespace, { origin: "https://cal.com" });
    const ns = (Cal.ns?.[namespace] ?? Cal) as (...args: unknown[]) => void;
    ns("inline", {
      elementOrSelector: containerRef.current,
      calLink: CAL_LINK,
      layout: "month_view",
    });
    ns("ui", { hideEventTypeDetails: false });
    ns("on", {
      action: "bookingSuccessful",
      callback: () => trackEvent("calendar_book", { location: "contact" }),
    });
  }, []);

  if (!CAL_LINK) return null;

  return (
    <div className={className} hidden={!visible}>
      <div ref={containerRef} className="min-h-[28rem] w-full" />
    </div>
  );
}
