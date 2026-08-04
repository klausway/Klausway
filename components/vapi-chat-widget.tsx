"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

const SDK_SCRIPT =
  "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";

const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;
const SDK_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY;
const SDK_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_SDK_ASSISTANT_ID;

const VAPI_SDK =
  SDK_API_KEY && SDK_ASSISTANT_ID
    ? {
        apiKey: SDK_API_KEY,
        assistant: SDK_ASSISTANT_ID,
        config: {
          position: "bottom-right" as const,
          theme: {
            primary: "#0A2540",
            secondary: "#FFFFFF",
          },
        },
      }
    : null;

export function VapiChatWidget() {
  const widgetRootRef = useRef<HTMLDivElement>(null);
  const widgetMounted = useRef(false);
  const sdkInitialized = useRef(false);

  const initSdk = useCallback(() => {
    if (sdkInitialized.current || !VAPI_SDK || !window.vapiSDK?.run) return false;
    sdkInitialized.current = true;
    window.vapiSDK.run(VAPI_SDK);
    return true;
  }, []);

  useEffect(() => {
    const root = widgetRootRef.current;
    if (!root || widgetMounted.current) return;
    if (!ASSISTANT_ID || !PUBLIC_KEY) return;

    widgetMounted.current = true;

    if (!root.querySelector("vapi-widget")) {
      const widget = document.createElement("vapi-widget");
      widget.setAttribute("assistant-id", ASSISTANT_ID);
      widget.setAttribute("public-key", PUBLIC_KEY);
      root.appendChild(widget);
    }
  }, []);

  useEffect(() => {
    if (!VAPI_SDK) return;
    if (initSdk()) return;

    // Script may load after this effect if the window "load" event already fired.
    const id = window.setInterval(() => {
      if (initSdk()) window.clearInterval(id);
    }, 250);

    const timeout = window.setTimeout(() => window.clearInterval(id), 15000);

    return () => {
      window.clearInterval(id);
      window.clearTimeout(timeout);
    };
  }, [initSdk]);

  const isConfigured = Boolean((ASSISTANT_ID && PUBLIC_KEY) || VAPI_SDK);
  if (!isConfigured) return null;

  return (
    <>
      <div
        ref={widgetRootRef}
        id="vapi-widget-root"
        className="pointer-events-none fixed bottom-5 right-5 z-[9999] [&>*]:pointer-events-auto"
        aria-hidden
      />
      <Script
        src={SDK_SCRIPT}
        strategy="afterInteractive"
        onLoad={() => {
          initSdk();
        }}
      />
    </>
  );
}
