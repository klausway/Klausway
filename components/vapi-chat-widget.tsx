"use client";

import { useCallback, useRef } from "react";
import Script from "next/script";

/**
 * Official Vapi Web Widget (chat).
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
  const rootRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);

  const mountWidget = useCallback(() => {
    const root = rootRef.current;
    if (!root || mounted.current || !ASSISTANT_ID || !PUBLIC_KEY) return;

    if (root.querySelector("vapi-widget")) {
      mounted.current = true;
      return;
    }

    const widget = document.createElement("vapi-widget");
    widget.setAttribute("public-key", PUBLIC_KEY);
    widget.setAttribute("assistant-id", ASSISTANT_ID);
    widget.setAttribute("mode", MODE);
    widget.setAttribute("theme", "light");
    widget.setAttribute("position", "bottom-right");
    widget.setAttribute("size", "compact");
    widget.setAttribute("radius", "large");
    widget.setAttribute("accent-color", "#0A2540");
    widget.setAttribute("button-base-color", "#0A2540");
    widget.setAttribute("button-accent-color", "#FFFFFF");
    widget.setAttribute("main-label", "Chat with Klaus Way");
    widget.setAttribute(
      "empty-chat-message",
      "Hi! How can we help you today?",
    );
    root.appendChild(widget);
    mounted.current = true;
  }, []);

  if (!ASSISTANT_ID || !PUBLIC_KEY) return null;

  return (
    <>
      <div ref={rootRef} id="vapi-widget-root" className="contents" />
      <Script
        src={WIDGET_SCRIPT}
        strategy="afterInteractive"
        onLoad={mountWidget}
      />
    </>
  );
}
