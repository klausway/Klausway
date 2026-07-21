/**
 * Slowly-moving gradient orbs rendered behind a section.
 * Pure CSS / no JavaScript, runs on the compositor, GPU-cheap.
 */
export function AmbientBackground({ variant = "hero" }: { variant?: "hero" | "section" }) {
  if (variant === "hero") {
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-20 left-1/4 h-[28rem] w-[28rem] rounded-full bg-brand-500/18 blur-3xl animate-blob-1" />
        <div className="absolute top-40 right-1/4 h-[26rem] w-[26rem] rounded-full bg-fuchsia-500/14 blur-3xl animate-blob-2" />
        <div className="absolute top-80 left-1/3 h-[20rem] w-[20rem] rounded-full bg-cyan-500/12 blur-3xl animate-blob-3" />
      </div>
    );
  }
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-brand-500/10 blur-3xl animate-blob-1" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl animate-blob-2" />
    </div>
  );
}
