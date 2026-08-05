"use client";

import { useCallback, useEffect, useState } from "react";
import { RECAPTCHA_CONTACT_ACTION } from "@/lib/recaptcha-constants";

const SCRIPT_ID = "recaptcha-v3-script";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function getSiteKey(): string | undefined {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() || undefined;
}

function loadRecaptchaScript(siteKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.grecaptcha) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise((resolve, reject) => {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("reCAPTCHA failed to load")), {
        once: true,
      });
      // Already loaded
      if (window.grecaptcha) resolve();
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("reCAPTCHA failed to load"));
    document.head.appendChild(script);
  });
}

/**
 * Load reCAPTCHA v3 and return a token for the contact action.
 * Returns null when site key is not configured (dev without keys).
 */
export function useRecaptchaV3() {
  const siteKey = getSiteKey();
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!siteKey) {
      setReady(true);
      return;
    }

    let cancelled = false;
    void loadRecaptchaScript(siteKey)
      .then(() => {
        if (cancelled) return;
        window.grecaptcha?.ready(() => {
          if (!cancelled) setReady(true);
        });
      })
      .catch((err) => {
        if (!cancelled) {
          setLoadError(err instanceof Error ? err.message : "reCAPTCHA failed to load");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!siteKey) return null;
    if (!window.grecaptcha) {
      throw new Error("Bot protection is still loading. Please wait a moment.");
    }

    return new Promise((resolve, reject) => {
      window.grecaptcha!.ready(() => {
        window
          .grecaptcha!.execute(siteKey, { action: RECAPTCHA_CONTACT_ACTION })
          .then(resolve)
          .catch(() => reject(new Error("Bot verification failed. Please try again.")));
      });
    });
  }, [siteKey]);

  return {
    enabled: Boolean(siteKey),
    ready,
    loadError,
    getToken,
  };
}
