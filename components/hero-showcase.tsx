import { BrowserFrame } from "./ui/browser-frame";

/**
 * Real product screenshots layered like a desk of shipped work — replaces the
 * old hand-built fake dashboard.
 */
export function HeroShowcase() {
  return (
    <div className="relative mx-auto max-w-5xl">
      <BrowserFrame
        src="/products/klaus-connect.png"
        alt="Klaus Connect CRM — pipeline and activity dashboard"
        url="Klaus Connect — CRM"
        priority
        className="relative z-10"
      />
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
          src="/products/klr-ai-2.png"
          alt="KLR AI — ask your database in plain English"
          url="KLR AI"
        />
      </div>
    </div>
  );
}
