import { type PathEntry, path } from "@jrk/content";
import { useEffect, useState } from "react";
import { Ticker } from "@/components/Ticker";
import { useInViewOnce, usePrefersReducedMotion } from "@/lib/hooks";
import { SectionHead } from "./SectionHead";

// `git log --graph`, but for a career. The graph is drawn from the entries:
// a merge opens the side lane, a branch closes it.

type Row =
  | { kind: "entry"; lanes: [boolean, boolean]; dot: 0 | 1; entry: PathEntry }
  | { kind: "fork" | "join"; lanes: [boolean, boolean] };

function layout(entries: PathEntry[]): Row[] {
  const rows: Row[] = [];
  let open = false;
  for (const e of entries) {
    const side = e.branch === "internships";
    rows.push({ kind: "entry", entry: e, dot: side ? 1 : 0, lanes: [true, open] });
    if (e.kind === "merge") {
      rows.push({ kind: "fork", lanes: [true, false] });
      open = true;
    }
    if (e.kind === "branch") {
      rows.push({ kind: "join", lanes: [true, false] });
      open = false;
    }
  }
  return rows;
}

const X = [6, 20];

/** The graph column: lane lines that stretch with the row, a dot, or a diagonal. */
function Lanes({ row, last }: { row: Row; last: boolean }) {
  return (
    <svg
      aria-hidden
      className="absolute inset-y-0 left-0 h-full w-[26px] overflow-visible"
      viewBox="0 0 26 100"
      preserveAspectRatio="none"
    >
      {row.lanes.map((on, lane) =>
        on ? (
          <line
            key={lane}
            x1={X[lane]}
            x2={X[lane]}
            y1={0}
            y2={last && lane === 0 && row.kind === "entry" ? 22 : 100}
            className="stroke-kesari/45"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
          />
        ) : null,
      )}
      {row.kind === "fork" && (
        <line
          x1={X[0]}
          y1={0}
          x2={X[1]}
          y2={100}
          className="stroke-kesari/45"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      )}
      {row.kind === "join" && (
        <line
          x1={X[1]}
          y1={0}
          x2={X[0]}
          y2={100}
          className="stroke-kesari/45"
          strokeWidth="1.25"
          vectorEffect="non-scaling-stroke"
        />
      )}
    </svg>
  );
}

const FALLBACK: Record<number, number> = { 2022: 6, 2023: 16, 2024: 82, 2025: 643, 2026: 1292 };

async function fetchContributions(): Promise<Record<number, number>> {
  // Written at build time by scripts/contributions.ts — no third-party request from the browser.
  const res = await fetch("/contributions.json");
  if (!res.ok) throw new Error(String(res.status));
  const data = (await res.json()) as { totals?: Record<string, number> };
  const out: Record<number, number> = { ...FALLBACK };
  for (const [y, n] of Object.entries(data.totals ?? {})) out[Number(y)] = n;
  return out;
}

function Growth() {
  const [ref, seen] = useInViewOnce<HTMLDivElement>();
  const [counts, setCounts] = useState(FALLBACK);
  useEffect(() => {
    if (!seen) return;
    let live = true;
    fetchContributions().then(
      (c) => live && setCounts(c),
      () => {},
    );
    return () => {
      live = false;
    };
  }, [seen]);
  const years = Object.keys(counts).map(Number).sort();
  const max = Math.max(...years.map((y) => counts[y]));
  const W = 30;
  // Bars draw in once they're on screen; with reduced motion they're simply there.
  const reduced = usePrefersReducedMotion();
  const shown = seen || reduced;
  return (
    <figure ref={ref} className="m-0">
      <figcaption className="mb-4">
        <span className="label">
          <span className="text-neel">fig. 3</span> &nbsp;contributions per year
        </span>
        <span className="mono mt-1 block text-[10.5px] text-graphite">
          from the public GitHub calendar, which counts private work
        </span>
      </figcaption>
      <div className="mono text-[12px] leading-[2]" role="table" aria-label="GitHub contributions per year">
        {years.map((y, i) => {
          const n = counts[y];
          const cells = Math.max(1, Math.round((n / max) * W));
          return (
            // biome-ignore lint/a11y/useFocusableInteractive: a row in a static table, not a grid widget
            <div key={y} role="row" className="grid grid-cols-[3.2rem_minmax(0,1fr)_3.6rem] items-baseline gap-3">
              <span role="cell" className="text-graphite">
                {y}
              </span>
              <span role="cell" aria-hidden className="overflow-hidden whitespace-pre text-kesari">
                <span
                  className="growth-bar inline-block motion-safe:transition-[clip-path] motion-safe:duration-[1600ms] motion-safe:ease-lazy"
                  style={{ clipPath: shown ? "inset(0 0 0 0)" : "inset(0 100% 0 0)", transitionDelay: `${i * 180}ms` }}
                >
                  {"█".repeat(cells)}
                </span>
              </span>
              <span role="cell" className="text-right text-ink tabular-nums">
                <Ticker value={n.toLocaleString("en-US")} start={shown} delay={i * 180} duration={1400} />
              </span>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

export function PathLog({ n = "01" }: { n?: string }) {
  const rows = layout(path);
  const [ref, seen] = useInViewOnce<HTMLOListElement>("0px 0px -15% 0px");

  return (
    <section id="path" className="shell py-16 md:py-24" aria-labelledby="path-title">
      <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-20">
        <div>
          <SectionHead n={n} id="path-title" kicker="git log --graph" title="The path so far" />
          <ol ref={ref} className="mt-12" aria-label="Career, newest first">
            {rows.map((row, i) =>
              row.kind !== "entry" ? (
                <li
                  key={`${row.kind}${i}`}
                  aria-hidden
                  className="path-row relative h-6"
                  style={{ ["--i" as string]: i }}
                  data-seen={seen}
                >
                  <Lanes row={row} last={false} />
                </li>
              ) : (
                <li
                  key={row.entry.hash + row.entry.title}
                  className="path-row relative grid grid-cols-[minmax(0,1fr)] gap-x-3 pl-10 sm:grid-cols-[5.6rem_minmax(0,1fr)]"
                  style={{ ["--i" as string]: i }}
                  data-seen={seen}
                >
                  <Lanes row={row} last={i === rows.length - 1} />
                  <span
                    aria-hidden
                    className={`absolute top-[0.55rem] size-[9px] -translate-x-1/2 rounded-full border-[1.5px] ${
                      row.entry.kind === "merge" ? "border-kesari bg-kesari" : "border-ink bg-paper"
                    }`}
                    style={{ left: `${X[row.dot]}px` }}
                  />
                  <span className="mono hidden pt-[5px] text-[11.5px] text-graphite sm:block">{row.entry.date}</span>
                  <span className="min-w-0 pb-8">
                    <span className="mono block text-[11px] text-graphite sm:hidden">{row.entry.date}</span>
                    <span className="block text-[1.08rem] leading-snug text-ink">
                      {row.entry.kind === "merge" && <span className="mono mr-2 text-[11px] text-neel">merge</span>}
                      {row.entry.title}
                    </span>
                    {row.entry.detail && (
                      <span className="mt-1 block text-[0.95rem] leading-[1.55] text-ink-2">{row.entry.detail}</span>
                    )}
                  </span>
                </li>
              ),
            )}
          </ol>
        </div>
        <div className="lg:pt-40">
          <div className="reveal lg:sticky lg:top-28">
            <Growth />
            <p className="hand mt-6 text-[13px] leading-[1.6]">
              six contributions in 2022. the line bends where the agents start.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
