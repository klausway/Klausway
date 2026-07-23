"use client";

import { useEffect, useRef } from "react";
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

function pinSupportButton(btn: HTMLElement) {
  if (btn.parentElement !== document.body) {
    document.body.appendChild(btn);
  }
  btn.style.setProperty("position", "fixed", "important");
  btn.style.setProperty("bottom", "1.25rem", "important");
  btn.style.setProperty("right", "1.25rem", "important");
  btn.style.setProperty("top", "auto", "important");
  btn.style.setProperty("left", "auto", "important");
  btn.style.setProperty("z-index", "9999", "important");
}

export function VapiChatWidget() {
  const widgetRootRef = useRef<HTMLDivElement>(null);
  const widgetMounted = useRef(false);
  const sdkInitialized = useRef(false);

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
    const initSdk = () => {
      if (sdkInitialized.current || !window.vapiSDK?.run) return;
      sdkInitialized.current = true;
      window.vapiSDK.run(VAPI_SDK);
    };

    const onLoad = () => initSdk();
    window.addEventListener("load", onLoad);

    if (document.readyState === "complete") {
      initSdk();
    }

    return () => window.removeEventListener("load", onLoad);
  }, []);

  useEffect(() => {
    const pinExisting = () => {
      const btn = document.getElementById("vapi-support-btn");
      if (btn) pinSupportButton(btn);
    };

    pinExisting();

    const observer = new MutationObserver(() => pinExisting());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={widgetRootRef}
        id="vapi-widget-root"
        className="pointer-events-none fixed bottom-5 right-5 z-[9999] [&>*]:pointer-events-auto"
        aria-hidden
      />
      <Script src={SDK_SCRIPT} strategy="afterInteractive" />
    </>
  );
}
