"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/navigation";

/** Legacy Klaus Connect URL — product is WorkNex; keep old links working in the static export. */
export default function KlausConnectProductRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`${routes.products}/worknex/`);
  }, [router]);
  return (
    <p className="px-6 py-24 text-center text-sm text-muted-foreground">
      Redirecting to WorkNex…
    </p>
  );
}
