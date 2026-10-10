import { AsciiDiagram } from "@jrk/ascii/react";
import type { Diagram, Scenario, Span } from "@jrk/content";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTween } from "@/components/Ticker";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { inline } from "@/lib/inline";

const TRACK = 26;
const PARTIAL = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉"];

/** A waterfall bar drawn in block characters, eighth-cell precise at the end. */
function bar(span: Span, total: number) {
  const start = (span.at / total) * TRACK;
  const end = Math.max(start + 0.2, ((span.at + span.ms) / total) * TRACK);
  const s = Math.floor(start);
  let out = "·".repeat(s);
  const full = Math.floor(end) - s;
  // Eighths round up to a whole cell at 8 — PARTIAL stops at 7.
  const eighth = (n: number) => (n >= 8 ? "█" : (PARTIAL[n] ?? ""));
  if (full <= 0) out += eighth(Math.max(1, Math.round((end - start) * 8)));
  else {
    out += "█".repeat(full);
    const frac = Math.round((end - Math.floor(end)) * 8);
    if (frac > 0 && out.length < TRACK) out += eighth(frac);
  }
  return (out + "·".repeat(TRACK)).slice(0, TRACK);
}

const fmt = (ms: number) => (ms < 1 ? "—" : ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);

interface Props {
  diagram: Diagram;
  scenarios: Scenario[];
  /** Accessible name for the row of scenario chips. */
  chooseLabel?: string;
  /** What one trace is called in its header — "turn", "upload". */
  noun?: string;
}

/** Scripted traces through a system: pick a scenario, watch each span light its part of the diagram. */
export function TraceReplay({ diagram, scenarios, chooseLabel = "Choose a scenario to replay", noun = "turn" }: Props) {
  const reduced = usePrefersReducedMotion();
  const [sid, setSid] = useState(scenarios[0].id);
  const scenario = scenarios.find((s) => s.id === sid) ?? scenarios[0];
  const [idx, setIdx] = useState(reduced ? scenario.spans.length - 1 : -1);
  const [playing, setPlaying] = useState(!reduced);
  const [speed, setSpeed] = useState(1);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const done = idx >= scenario.spans.length - 1;
  const span = idx >= 0 ? scenario.spans[idx] : undefined;

  useEffect(() => {
    if (!playing || !inView || done) return;
    const next = scenario.spans[idx + 1];
    const wait = (idx < 0 ? 700 : Math.min(5200, 1500 + (span?.why.length ?? 0) * 24)) / speed;
    const t = window.setTimeout(() => setIdx((i) => i + 1), next ? wait : 0);
    return () => window.clearTimeout(t);
  }, [playing, inView, done, idx, scenario, span, speed]);

  const total = useMemo(() => Math.max(...scenario.spans.map((s) => s.at + s.ms)), [scenario]);
  // The clock: where the turn is, in its own (illustrative) time, gliding from span to span.
  const clock = useTween(span ? span.at + span.ms : 0);

  function pick(id: string) {
    setSid(id);
    const s = scenarios.find((x) => x.id === id)!;
    setIdx(reduced ? s.spans.length - 1 : 0);
    setPlaying(!reduced);
  }

  return (
    <div>
      <div className="mono mt-10 flex flex-wrap gap-2 text-[12px]" role="group" aria-label={chooseLabel}>
        {scenarios.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => pick(s.id)}
            aria-pressed={s.id === sid}
            className={`press rounded-full border px-3 py-1.5 transition-colors duration-200 ${
              s.id === sid
                ? "border-ink bg-ink text-paper"
                : "border-rule text-ink-2 hover:border-graphite hover:text-ink"
            }`}
          >
            {s.chip}
          </button>
        ))}
      </div>

      <div ref={ref} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:gap-16">
        <div className="hidden lg:block">
          <div className="sticky top-24" style={{ ["--ascii-bg" as string]: "var(--paper)" }}>
            <AsciiDiagram
              src={diagram.src}
              aliases={diagram.aliases}
              label={diagram.label}
              activeNodes={span?.nodes ?? []}
              activeEdges={span?.edges ?? []}
              maxFontPx={13.5}
              speed={12}
            />
          </div>
        </div>

        <div className="min-w-0">
          <div className="rounded-[6px] border border-rule bg-card/70 p-5 sm:p-6">
            <div className="mono flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-dashed border-rule pb-4 text-[12px]">
              <p className="min-w-0 text-ink">
                <span className="text-graphite">{noun} · </span>“{scenario.ask}”
                {scenario.attachment && (
                  <span className="ml-2 whitespace-nowrap rounded-[3px] bg-paper-2 px-1.5 py-0.5 text-[11px] text-ink-2">
                    ⎘ {scenario.attachment}
                  </span>
                )}
              </p>
              <span
                className="text-[11px] text-graphite"
                title="The shape of each trace is real; the timings are made up for the example."
              >
                <span className="text-ink tabular-nums">
                  t = {clock < 1000 ? `${Math.round(clock)} ms` : `${(clock / 1000).toFixed(2)} s`}
                </span>{" "}
                · timings illustrative
              </span>
            </div>

            <ol className="mono mt-3 text-[12px] leading-[2.05]" aria-label="Trace of the turn">
              {scenario.spans.map((s, i) => {
                const reached = i <= idx;
                const active = i === idx;
                const toneClass = s.tone === "stop" ? "text-kesari-ink" : s.tone === "warn" ? "text-ink-2" : "text-ink";
                return (
                  <li
                    key={`${sid}-${i}`}
                    aria-current={active ? "step" : undefined}
                    className="grid grid-cols-[1.1em_minmax(0,8.5em)_minmax(0,1fr)] items-baseline gap-x-2 sm:grid-cols-[1.1em_8.5em_auto_4.2em_minmax(0,1fr)]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIdx(i);
                        setPlaying(false);
                      }}
                      className={`-mx-1.5 inline-grid h-6 w-6 place-items-center self-center ${reached ? "text-kesari-ink" : "text-graphite"}`}
                      aria-label={`Jump to ${s.name}`}
                    >
                      {active ? "▸" : "·"}
                    </button>
                    <span className={`truncate ${s.depth ? "pl-3" : ""} ${reached ? toneClass : "text-graphite"}`}>
                      {s.depth ? "└ " : ""}
                      {s.name}
                    </span>
                    <span aria-hidden className="hidden whitespace-pre text-graphite sm:inline">
                      <span className={reached ? (s.tone === "stop" ? "text-kesari" : "text-ink-2") : "text-faint"}>
                        {reached ? (
                          <span key="bar" className="bar-fill inline-block">
                            {bar(s, total)}
                          </span>
                        ) : (
                          "·".repeat(TRACK)
                        )}
                      </span>
                    </span>
                    <span className="hidden text-right text-graphite tabular-nums sm:inline">
                      {reached ? fmt(s.ms) : ""}
                    </span>
                    <span className={`truncate ${reached ? "text-ink-2" : "text-transparent"}`}>{s.detail}</span>
                  </li>
                );
              })}
            </ol>

            <div
              className="mt-5 min-h-[6.5em] border-t border-dashed border-rule pt-4"
              aria-live={playing ? "off" : "polite"}
            >
              {span ? (
                <p key={`${sid}-${idx}`} className="fade-swap hand text-[13.5px] leading-[1.6]">
                  <span className="text-graphite">{span.name}: </span>
                  {inline(span.why)}
                </p>
              ) : (
                <p className="hand text-[13.5px] text-graphite">starting…</p>
              )}
            </div>
          </div>

          <div className="mono mt-3 flex flex-wrap items-center justify-end gap-3 text-[11.5px] text-graphite">
            <span className="flex gap-1" role="group" aria-label="Replay speed">
              {[0.5, 1, 2].map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={speed === v}
                  onClick={() => setSpeed(v)}
                  className={`min-h-6 min-w-7 px-1 ${speed === v ? "text-ink underline decoration-kesari underline-offset-4" : "hover:text-ink"}`}
                >
                  {v}×
                </button>
              ))}
            </span>
            <button
              type="button"
              className="min-h-6 px-1 hover:text-ink"
              onClick={() => setPlaying((p) => !p)}
              disabled={done}
            >
              {playing && !done ? "pause" : "play"}
            </button>
            <button
              type="button"
              className="min-h-6 px-1 hover:text-ink"
              onClick={() => {
                setIdx(0);
                setPlaying(true);
              }}
            >
              replay ↺
            </button>
          </div>
          <p
            className={`mt-4 max-w-[40rem] font-serif text-[1.05rem] leading-snug text-ink-2 transition-opacity duration-700 ${
              done ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!done}
          >
            <span className="mono mr-2 text-[12px] text-kesari">∴</span>
            {scenario.moral}
          </p>
        </div>
      </div>
    </div>
  );
}
