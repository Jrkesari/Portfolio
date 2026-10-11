import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

// Numbers that arrive by counting: "2/8 → 6/8" ticks the 2 up to 6, "77.8 s → 12 s"
// counts the seconds down, "1,292" counts up from zero. The motion is the claim:
// you watch the before become the after. It runs once, about a second, then rests.

type Parts = { head: string; n: number; decimals: number; grouped: boolean; tail: string };

const NUMBER = /^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/;

export function parseNumber(s: string): Parts | null {
  const m = NUMBER.exec(s);
  if (!m) return null;
  const raw = m[2];
  return {
    head: m[1],
    n: Number(raw.replace(/,/g, "")),
    decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
    grouped: raw.includes(","),
    tail: m[3],
  };
}

function show(p: Parts, n: number, decimals: number) {
  const body = p.grouped
    ? n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : n.toFixed(decimals);
  return `${p.head}${body}${p.tail}`;
}

const ease = (t: number) => 1 - (1 - t) ** 3;

interface Props {
  /** The value to land on, exactly as written ("6/8", "1,292", "12 s"). */
  value: string;
  /** Where to count from; a number in the same shape, or zero when left out. */
  from?: string;
  /** Start counting (for example once the thing is on screen). */
  start: boolean;
  delay?: number;
  duration?: number;
}

export function Ticker({ value, from, start, delay = 0, duration = 1000 }: Props) {
  const reduced = usePrefersReducedMotion();
  const to = parseNumber(value);
  // Count from the before only when it's the same kind of number ("2/8" → "6/8", "77.8 s" → "12 s");
  // "~170k tok" → "~30 tok" changes units, so that one counts up from zero.
  const parsed = from !== undefined ? parseNumber(from) : null;
  const origin = parsed && to && parsed.head === to.head && parsed.tail === to.tail ? parsed : null;
  const fromN = origin?.n ?? 0;
  const decimals = Math.max(to?.decimals ?? 0, origin?.decimals ?? 0);
  // Prerendered at build time, it's the final value: that's what a crawler should read.
  const [text, setText] = useState(() =>
    typeof window !== "undefined" && to && !reduced && fromN !== to.n ? show(to, fromN, decimals) : value,
  );
  const done = useRef(false);

  // `to` and `origin` are parsed afresh each render from the same strings, so the strings are the deps.
  useEffect(() => {
    if (!to || reduced || done.current || fromN === to.n) {
      setText(value);
      return;
    }
    if (!start) return;
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration));
      if (t >= 1) {
        done.current = true;
        setText(value);
        return;
      }
      setText(show(to, fromN + (to.n - fromN) * ease(t), decimals));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, from, reduced, delay, duration]);

  return (
    <>
      <span aria-hidden className="tick">
        {text}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}

/** A number that glides to each new value it's given (about 400 ms), then rests. */
export function useTween(target: number, duration = 400) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(target);
  const current = useRef(target);
  useEffect(() => {
    if (reduced) {
      current.current = target;
      setValue(target);
      return;
    }
    const from = current.current;
    if (from === target) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      current.current = from + (target - from) * ease(t);
      setValue(current.current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, reduced]);
  return value;
}

/** A value like "2/8 → 6/8": the before stays put, the after counts from it. */
export function BeforeAfter({ value, start, delay }: { value: string; start: boolean; delay?: number }) {
  const [before, after] = value.split(" → ");
  if (after === undefined) return <Ticker value={value} start={start} delay={delay} />;
  return (
    <>
      {before} → <Ticker value={after} from={before} start={start} delay={delay} />
    </>
  );
}
