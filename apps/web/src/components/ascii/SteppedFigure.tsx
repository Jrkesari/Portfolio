import { AsciiDiagram } from "@jrk/ascii/react";
import type { Diagram } from "@jrk/content";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Props {
  diagram: Diagram;
  /** e.g. "fig. 1" */
  fig?: string;
  title?: string;
  /** Auto-advance interval; 0 disables autoplay. */
  interval?: number;
  maxFontPx?: number;
  className?: string;
  /** "side" puts the caption beside a tall diagram on wide screens. */
  layout?: "stack" | "side";
  /** Autoplay stops after this many full cycles — nothing here loops forever. */
  maxCycles?: number;
  /** Show the two-colour legend under the figure. */
  legend?: boolean;
}

/** A diagram that steps through its own story, slowly, with a caption and controls. */
export function SteppedFigure({
  diagram,
  fig,
  title,
  interval = 4600,
  maxFontPx = 14,
  className = "",
  layout = "stack",
  maxCycles = 2,
  legend = false,
}: Props) {
  const reduced = usePrefersReducedMotion();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(interval > 0 && !reduced);
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [cycles, setCycles] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // A new diagram starts from its first step.
  useEffect(() => {
    setI(0);
    setCycles(0);
  }, [diagram.id]);

  useEffect(() => {
    if (!playing || hovering || focused || !visible || interval <= 0) return;
    const t = window.setTimeout(() => {
      const last = i === diagram.steps.length - 1;
      if (last && cycles + 1 >= maxCycles) {
        setPlaying(false);
        setCycles(0);
        return;
      }
      if (last) setCycles((c) => c + 1);
      setI((x) => (x + 1) % diagram.steps.length);
    }, interval);
    return () => window.clearTimeout(t);
  }, [i, playing, hovering, focused, visible, interval, diagram.steps.length, cycles, maxCycles]);

  const at = Math.min(i, diagram.steps.length - 1);
  const step = diagram.steps[at];

  return (
    <div
      ref={ref}
      role="group"
      aria-label={title}
      className={`relative ${className}`}
      // Pause for a real hover (not a tap's emulated one) and while focus is inside.
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={() => setHovering(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
    >
      {(fig || title) && (
        <div className="mb-4 flex items-baseline gap-3">
          {fig && <span className="label text-neel">{fig}</span>}
          {title && <span className="label">{title}</span>}
        </div>
      )}
      <div
        className={
          layout === "side" ? "grid items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14" : ""
        }
      >
        <AsciiDiagram
          src={diagram.src}
          aliases={diagram.aliases}
          label={diagram.label}
          activeNodes={step.nodes}
          activeEdges={step.edges}
          notes={step.notes}
          maxFontPx={maxFontPx}
        />
        <div>
          {/* Spoken only when the reader moves it — not on every autoplay tick. */}
          <div className="mt-5 min-h-[4.8em]" aria-live={playing ? "off" : "polite"}>
            <p key={at} className="fade-swap max-w-[34rem] text-[15.5px] leading-[1.55] text-ink-2">
              <span className="mono mr-2 text-[11px] text-graphite">
                {String(at + 1).padStart(2, "0")}/{String(diagram.steps.length).padStart(2, "0")}
              </span>
              {step.caption}
            </p>
          </div>
          <div className="mono mt-2 flex items-center gap-1 text-[11px] text-graphite">
            {diagram.steps.map((_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setI(k);
                  setPlaying(false);
                }}
                aria-label={`Show step ${k + 1}`}
                aria-current={k === at ? "step" : undefined}
                className="group grid h-6 w-7 place-items-center"
              >
                <span
                  className={`block h-[3px] rounded-full transition-all duration-700 ease-lazy ${
                    k === at ? "w-5 bg-kesari-ink" : "w-2.5 bg-graphite/80 group-hover:bg-graphite"
                  }`}
                />
              </button>
            ))}
            {interval > 0 && (
              <button
                type="button"
                onClick={() => {
                  setPlaying((p) => !p);
                  // Pressing play overrides the focus pause; focus moving to a dot pauses it again.
                  setFocused(false);
                }}
                className="ml-2 rounded px-1.5 py-0.5 hover:text-ink"
                aria-label={playing ? "Pause the diagram" : "Play the diagram"}
              >
                {playing ? "pause" : "play"}
              </button>
            )}
          </div>
          {legend && (
            <p className="mono mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-graphite" aria-hidden>
              <span>
                <span className="text-neel">□</span> a component
              </span>
              <span>
                <span className="text-kesari">●</span> a request in flight
              </span>
              <span>
                <span className="text-graphite">┄▶</span> metered, off the hot path
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
