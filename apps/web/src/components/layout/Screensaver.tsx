import { AsciiDiagram } from "@jrk/ascii/react";
import { turnLoop } from "@jrk/content";
import { useEffect } from "react";
import { closeOverlay } from "@/lib/ui";
import { Clock } from "./Clock";

// The lazy bit. Sit on the home page's first screen without touching anything
// and the page dozes off into its own diagram, packets still drifting. Any
// input wakes it. Press "z" to nod off on purpose. Idle detection and the key
// live in Overlays; this is only what's on screen while the page sleeps.

const ALL_EDGES = turnLoop.steps.flatMap((s) => s.edges);
const ALL_NODES = ["agent-loop"];

export function Screensaver() {
  // Wake on anything — after a short grace period so the opening keypress doesn't count.
  useEffect(() => {
    let armed = false;
    const arm = window.setTimeout(() => (armed = true), 700);
    const wake = () => armed && closeOverlay();
    const events = ["pointermove", "pointerdown", "keydown", "wheel", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, wake, { passive: true });
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.clearTimeout(arm);
      for (const e of events) window.removeEventListener(e, wake);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    // Decorative: the page underneath stays readable to assistive tech, and any input wakes it.
    <div
      aria-hidden
      className="no-print fixed inset-0 z-[90] flex flex-col items-center justify-center gap-10 bg-paper px-6 animate-[fade-in_1.6s_var(--ease-lazy)_both]"
      style={{ ["--ascii-bg" as string]: "var(--paper)" }}
    >
      <div className="w-full max-w-[640px] motion-safe:animate-[drift_14s_ease-in-out_infinite_alternate]">
        <AsciiDiagram
          src={turnLoop.src}
          label={turnLoop.label}
          activeNodes={ALL_NODES}
          activeEdges={ALL_EDGES}
          print={false}
          speed={7}
          passes={Infinity}
          maxFontPx={18}
        />
      </div>
      <div className="space-y-2 text-center">
        <p className="font-serif text-2xl text-ink">Idle. So is the agent.</p>
        <p className="mono text-[12px] text-graphite">
          <Clock className="mr-2" /> · move, tap or press a key to wake it
        </p>
      </div>
    </div>
  );
}
