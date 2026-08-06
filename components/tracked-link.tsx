"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

type TrackedLinkProps = {
  href: string;
  event: AnalyticsEvent;
  eventParams?: Record<string, string>;
  /** Plain <a> for tel:/mailto:/external; next/link otherwise. */
  external?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

/** Link that fires a GA4 event on click — usable from server components. */
export function TrackedLink({
  href,
  event,
  eventParams,
  external = false,
  className,
  children,
  ...rest
}: TrackedLinkProps) {
  const onClick = () => trackEvent(event, eventParams);
  if (external || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} onClick={onClick} className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </Link>
  );
}
