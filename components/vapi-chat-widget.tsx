"use client";

import { useCallback, useRef } from "react";
import Script from "next/script";

/**
 * Official Vapi Web Widget (chat).
 * Loaded from the embed UMD, which exposes window.WidgetLoader.
 * @see https://docs.vapi.ai/chat/web-widget
 */
const WIDGET_SCRIPT =
  "https://unpkg.com/@vapi-ai/client-sdk-react/dist/embed/widget.umd.js";

// Publishable client keys — safe in the browser. Override with NEXT_PUBLIC_VAPI_*.
const ASSISTANT_ID =
  process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID ||
  "0db87fab-f87f-4919-a21e-31469df88433";
const PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ||
  "b567aa4f-4374-4545-8f93-8d8c66b3670e";

const MODE = process.env.NEXT_PUBLIC_VAPI_MODE || "chat";

export function VapiChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const initWidget = useCallback(() => {
    const container = containerRef.current;
    const Loader = window.WidgetLoader;
    if (!container || !Loader || initialized.current) return;
    if (!ASSISTANT_ID || !PUBLIC_KEY) return;

    // Avoid double-mount under React Strict Mode / remounts.
    if (container.childElementCount > 0) {
      initialized.current = true;
      return;
    }

    try {
      new Loader({
        container,
        component: "VapiWidget",
        props: {
          publicKey: PUBLIC_KEY,
          assistantId: ASSISTANT_ID,
          mode: MODE,
          theme: "light",
          position: "bottom-right",
          size: "compact",
          radius: "large",
          accentColor: "#0A2540",
          buttonBaseColor: "#0A2540",
          buttonAccentColor: "#FFFFFF",
          mainLabel: "Chat with us",
          emptyChatMessage: "Hi! How can we help you today?",
        },
      });
      initialized.current = true;
    } catch (error) {
      console.error("Failed to initialize Vapi chat widget:", error);
    }
  }, []);

  if (!ASSISTANT_ID || !PUBLIC_KEY) return null;

  return (
    <>
      <div ref={containerRef} id="vapi-widget-root" />
      <Script
        src={WIDGET_SCRIPT}
        strategy="afterInteractive"
        onLoad={initWidget}
      />
    </>
  );
}
