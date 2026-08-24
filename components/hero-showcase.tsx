import { BrowserFrame } from "./ui/browser-frame";
import { TrackedLink } from "./tracked-link";
import { worknexUrl } from "@/lib/navigation";

/**
 * Real product screenshots layered like a desk of shipped work — replaces the
 * old hand-built fake dashboard.
 */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <TrackedLink
        href={worknexUrl}
        external
        target="_blank"
        rel="noopener noreferrer"
        event="cta_click"
        eventParams={{ location: "hero_showcase", product: "worknex" }}
        className="relative z-10 block"
        aria-label="Visit Worknex"
      >
        <BrowserFrame
          src="/products/worknex.png"
          alt="Worknex — company scoreboard with live pipeline and revenue"
          url="work-nex.com"
          priority
        />
      </TrackedLink>
      <div
        className="absolute -left-6 -bottom-10 z-20 hidden w-[38%] -rotate-1 animate-fade-up-stagger md:block lg:-left-14"
        style={{ animationDelay: "950ms" }}
      >
        <BrowserFrame
          src="/products/dispatcher.png"
          alt="Klaus Dispatcher — live scheduling board"
          url="Dispatcher"
        />
      </div>
      <div
        className="absolute -right-6 -top-10 z-20 hidden w-[30%] rotate-1 animate-fade-up-stagger md:block lg:-right-14"
        style={{ animationDelay: "1100ms" }}
      >
        <BrowserFrame
          src="/products/apronconnect.png"
          alt="ApronConnect — branded restaurant menu, ready to order"
          url="apronconnect.com"
        />
      </div>
    </div>
  );
}
