import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { type Cell, parseAscii } from "./index.ts";

/** Line height of a diagram row, in em. Box-drawing glyphs in JRK Mono overlap at ≤ 1.24. */
const LH = 1.2;

const REDUCED = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  const subscribe = useCallback((cb: () => void) => {
    if (typeof window === "undefined" || !window.matchMedia) return () => {};
    const mql = window.matchMedia(REDUCED);
    mql.addEventListener("change", cb);
    return () => mql.removeEventListener("change", cb);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(REDUCED).matches : false),
    () => false,
  );
}

export interface AsciiNote {
  r: number;
  c: number;
  text: ReactNode;
  /** Draw the note after the print-in finishes, with this extra delay (ms). */
  delay?: number;
}

export interface AsciiDiagramProps {
  src: string;
  /** Short description for screen readers. The diagram itself is decorative. */
  label: string;
  aliases?: Record<string, string>;
  activeNodes?: string[];
  activeEdges?: Array<[string, string]>;
  notes?: AsciiNote[];
  /** Send packets along active edges. */
  packets?: boolean;
  /** Print the diagram in, row by row, the first time it scrolls into view. */
  print?: boolean;
  /** Cells per second for packets. Slow on purpose. */
  speed?: number;
  /** How many trips each packet makes before it rests. Nothing loops forever, except a screensaver. */
  passes?: number;
  maxFontPx?: number;
  className?: string;
  onNodeHover?: (id: string | null) => void;
}

type RunClass = "" | "n" | "e";

export function AsciiDiagram({
  src,
  label,
  aliases,
  activeNodes = [],
  activeEdges = [],
  notes = [],
  packets = true,
  print = true,
  speed = 14,
  passes = 6,
  maxFontPx = 14,
  className = "",
  onNodeHover,
}: AsciiDiagramProps) {
  const graph = useMemo(() => parseAscii(src, aliases), [src, aliases]);
  const reduced = usePrefersReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const packetLayer = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [printed, setPrinted] = useState(!print);
  const [hover, setHover] = useState<string | null>(null);

  // Callers pass fresh arrays on every render; key the memos by content instead.
  // Slugs never contain "|" or ">".
  const nodeKey = activeNodes.join("|");
  const edgeKey = activeEdges.map((e) => e.join(">")).join("|");
  const nodeSet = useMemo(() => new Set(nodeKey ? nodeKey.split("|") : []), [nodeKey]);
  const edgePaths = useMemo(
    () =>
      edgeKey
        ? edgeKey
            .split("|")
            .map((k) => k.split(">"))
            .map(([a, b]) => graph.path(a, b))
            .filter((p) => p.length > 0)
        : [],
    [graph, edgeKey],
  );

  const edgeCells = useMemo(() => {
    const s = new Set<string>();
    for (const p of edgePaths) for (const { r, c } of p) s.add(`${r},${c}`);
    return s;
  }, [edgePaths]);

  // Row → runs of same-class characters.
  const rendered = useMemo(() => {
    return graph.rows.map((row, r) => {
      const chars = [...row];
      const runs: { cls: RunClass; text: string }[] = [];
      for (let c = 0; c < chars.length; c++) {
        const node = graph.nodeAt(r, c);
        const cls: RunClass = node && nodeSet.has(node.id) ? "n" : edgeCells.has(`${r},${c}`) ? "e" : "";
        const last = runs[runs.length - 1];
        if (last && last.cls === cls) last.text += chars[c];
        else runs.push({ cls, text: chars[c] });
      }
      return runs;
    });
  }, [graph, nodeSet, edgeCells]);

  // Observe visibility: start printing once, and only animate packets on screen.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "0px 0px -10% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (printed || !inView) return;
    if (reduced) {
      setPrinted(true);
      return;
    }
    const t = window.setTimeout(() => setPrinted(true), graph.height * 42 + 120);
    return () => window.clearTimeout(t);
  }, [inView, printed, reduced, graph.height]);

  // Packets: a head (●) and a two-cell trail stepping cell by cell. No React
  // re-render per frame — we move spans directly.
  useEffect(() => {
    const layer = packetLayer.current;
    if (!layer || !packets || reduced || !inView || !printed || edgePaths.length === 0) {
      if (layer) layer.replaceChildren();
      return;
    }
    const doc = layer.ownerDocument;
    const items = edgePaths.map((cells, i) => {
      const spans = [0, 1, 2].map((k) => {
        const s = doc.createElement("span");
        s.className = k === 0 ? "ascii-packet" : "ascii-trail";
        s.style.opacity = "0";
        layer.appendChild(s);
        return s;
      });
      // The glyph under each cell, read once — the trail redraws the line it walks on.
      const glyphs = cells.map((c) => [...graph.rows[c.r]][c.c]);
      return { cells, glyphs, spans, offset: i * 7, last: -1 };
    });

    const place = (s: HTMLSpanElement, cell: Cell | undefined, glyph: string | undefined) => {
      if (!cell || glyph === undefined) {
        if (s.style.opacity !== "0") s.style.opacity = "0";
        return;
      }
      s.textContent = glyph;
      s.style.transform = `translate(${cell.c}ch, ${cell.r * LH}em)`;
      if (s.style.opacity !== "1") s.style.opacity = "1";
    };

    // A packet moves `speed` cells a second, so wake up that often, not every frame.
    // Steps come from elapsed time, so a late timer never makes a packet drift.
    let timer = 0;
    const start = performance.now();
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      let moving = false;
      for (const it of items) {
        const cycle = it.cells.length + 10;
        const step = Math.floor(t * speed + it.offset);
        if (step >= cycle * passes) {
          if (it.last !== -2) for (const s of it.spans) place(s, undefined, undefined);
          it.last = -2;
          continue;
        }
        moving = true;
        if (step === it.last) continue;
        it.last = step;
        const pos = step % cycle;
        place(it.spans[0], it.cells[pos], it.cells[pos] ? "●" : undefined);
        place(it.spans[1], it.cells[pos - 1], it.glyphs[pos - 1]);
        place(it.spans[2], it.cells[pos - 2], it.glyphs[pos - 2]);
      }
      // Wake just after the next step boundary, so a slow timer never skips a cell.
      if (moving) timer = window.setTimeout(tick, ((Math.floor(t * speed) + 1) / speed - t) * 1000 + 1);
    };
    tick();
    return () => {
      window.clearTimeout(timer);
      layer.replaceChildren();
    };
  }, [edgePaths, packets, reduced, inView, printed, speed, passes, graph]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!onNodeHover) return;
    const el = stageRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const c = Math.floor(((e.clientX - rect.left) / rect.width) * graph.width);
    const r = Math.floor(((e.clientY - rect.top) / rect.height) * graph.height);
    const id = graph.nodeAt(r, c)?.id ?? null;
    if (id !== hover) {
      setHover(id);
      onNodeHover(id);
    }
  }

  const focus = nodeSet.size > 0 || edgePaths.length > 0;
  const hovered = hover ? graph.nodes.get(hover) : undefined;

  return (
    // A div, not a figure: callers often wrap this in their own <figure> with a caption.
    <div
      className={`ascii ${className}`}
      style={{ "--cols": graph.width, "--rows": graph.height, "--max-fs": `${maxFontPx}px` } as CSSProperties}
    >
      <div className="ascii-fit">
        <div
          ref={stageRef}
          role="img"
          aria-label={label}
          className={`ascii-stage ${focus ? "has-focus" : ""} ${printed ? "is-printed" : inView && !reduced ? "is-printing" : print && !reduced ? "is-waiting" : ""}`}
          onMouseMove={onNodeHover ? handleMove : undefined}
          onMouseLeave={
            onNodeHover
              ? () => {
                  setHover(null);
                  onNodeHover(null);
                }
              : undefined
          }
        >
          {[...graph.nodes.values()]
            .filter((n) => nodeSet.has(n.id) || n === hovered)
            .map((n) => (
              <div
                key={n.id}
                aria-hidden
                className={`ascii-tint ${nodeSet.has(n.id) ? "is-active" : "is-hover"}`}
                style={{
                  left: `${n.c}ch`,
                  top: `${n.r * LH}em`,
                  width: `${n.c2 - n.c + 1}ch`,
                  height: `${(n.r2 - n.r + 1) * LH}em`,
                }}
              />
            ))}
          <pre aria-hidden className="ascii-pre">
            {rendered.map((runs, r) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: rows are positions in a fixed grid
              <span key={r} className="ascii-row">
                {runs.map((run, i) =>
                  run.cls ? (
                    // biome-ignore lint/suspicious/noArrayIndexKey: runs are positions within a row
                    <span key={i} className={run.cls === "n" ? "ascii-n" : "ascii-e"}>
                      {run.text}
                    </span>
                  ) : (
                    run.text
                  ),
                )}
              </span>
            ))}
          </pre>
          <div ref={packetLayer} aria-hidden className="ascii-packets" />
          {notes.map((n, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: notes are static and never reorder
              key={i}
              aria-hidden
              className={`ascii-note ${printed ? "is-shown" : ""}`}
              style={{
                left: `${n.c}ch`,
                top: `${n.r * LH}em`,
                transitionDelay: `${n.delay ?? 200 + i * 160}ms`,
              }}
            >
              {n.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
