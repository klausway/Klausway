"use client";

import { useCallback, useEffect, useRef } from "react";
import Script from "next/script";

const SDK_SCRIPT =
  "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";

const ASSISTANT_ID = "0db87fab-f87f-4919-a21e-31469df88433";
const PUBLIC_KEY = "b567aa4f-4374-4545-8f93-8d8c66b3670e";

const VAPI_SDK = {
  apiKey: "64f6e7bc-e983-498b-9c36-b21810378753",
  assistant: "50dd647c-790e-48f6-ad20-4f5945b7d4fa",
  config: {
    position: "bottom-right" as const,
    theme: {
      primary: "#0A2540",
      secondary: "#FFFFFF",
    },
  },
};

export function VapiChatWidget() {
  const widgetRootRef = useRef<HTMLDivElement>(null);
  const widgetMounted = useRef(false);
  const sdkInitialized = useRef(false);

  const initSdk = useCallback(() => {
    if (sdkInitialized.current || !window.vapiSDK?.run) return false;
    sdkInitialized.current = true;
    window.vapiSDK.run(VAPI_SDK);
    return true;
  }, []);

  useEffect(() => {
    const root = widgetRootRef.current;
    if (!root || widgetMounted.current) return;

    widgetMounted.current = true;

    if (!root.querySelector("vapi-widget")) {
      const widget = document.createElement("vapi-widget");
      widget.setAttribute("assistant-id", ASSISTANT_ID);
      widget.setAttribute("public-key", PUBLIC_KEY);
      root.appendChild(widget);
    }
  }, []);

  useEffect(() => {
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
