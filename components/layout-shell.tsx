"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgressClient } from "@/components/scroll-progress-client";
import { VapiChatWidget } from "@/components/vapi-chat-widget";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgressClient />
      <Navbar />
      <main className="relative">{children}</main>
      <Footer />
      <VapiChatWidget />
    </>
  );
}
