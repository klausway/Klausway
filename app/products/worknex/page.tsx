"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/navigation";

/** Worknex was renamed to Klaus Connect; keep old links working in the static export. */
export default function WorknexProductRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`${routes.products}/klaus-connect/`);
  }, [router]);
  return (
    <p className="px-6 py-24 text-center text-sm text-muted-foreground">
      Redirecting to Klaus Connect…
    </p>
  );
}
