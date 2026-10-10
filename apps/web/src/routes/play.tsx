import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { golfRounds } from "@/data/promptGolf";

// Prompt golf — kept from the previous version of the site, off the main path.
// The model call happens in /api/prompt-golf (a Vercel function); the key never
// reaches the browser.

export const Route = createFileRoute("/play")({
  component: Play,
});

interface SwingResult {
  output: string;
  matched: boolean;
  words: number;
  latencyMs: number;
  model: string;
}

async function swing(input: { prompt: string; roundId: string }): Promise<SwingResult> {
  const res = await fetch("/api/prompt-golf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "The course is closed right now. Try again later.");
  return data as SwingResult;
}

/** A swing in flight, its result or its error. A reset or a newer swing makes an old reply stale. */
function useSwing(onSuccess: (data: SwingResult) => void) {
  const [state, setState] = useState<{ data?: SwingResult; error?: Error; isPending: boolean }>({ isPending: false });
  const seq = useRef(0);
  const mutate = (input: { prompt: string; roundId: string }) => {
    const id = ++seq.current;
    setState({ isPending: true });
    swing(input).then(
      (data) => {
        if (id !== seq.current) return;
        setState({ data, isPending: false });
        onSuccess(data);
      },
      (error: Error) => id === seq.current && setState({ error, isPending: false }),
    );
  };
  const reset = () => {
    seq.current++;
    setState({ isPending: false });
  };
  return { ...state, isError: state.error !== undefined, mutate, reset };
}

function score(words: number, par: number) {
  const d = words - par;
  if (d <= -2) return "eagle";
  if (d === -1) return "birdie";
  if (d === 0) return "par";
  if (d === 1) return "bogey";
  return `+${d}`;
}

function Play() {
  const [idx, setIdx] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [hint, setHint] = useState(false);
  const [cleared, setCleared] = useState<Record<string, number>>({});
  const round = golfRounds[idx];

  const mutation = useSwing((data) => {
    if (data.matched) setCleared((prev) => ({ ...prev, [round.id]: Math.min(prev[round.id] ?? Infinity, data.words) }));
  });
  const result = mutation.data;
  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  const go = (i: number) => {
    setIdx(i);
    setPrompt("");
    setHint(false);
    mutation.reset();
  };

  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <title>Prompt golf · Jayesh Ranjan Kesari</title>
      <div className="mx-auto max-w-[44rem]">
        <p className="label">
          play · {Object.keys(cleared).length}/{golfRounds.length} cleared
        </p>
        <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,4.6rem)] leading-[0.95] font-light tracking-[-0.04em]">
          Prompt golf
        </h1>
        <p className="mt-6 text-ink-2">
          Write the <em>shortest</em> prompt that makes a real model say exactly what's asked. Fewer words wins. It runs
          live on a 14B open model, rate-limited, behind a server function that holds the key.
        </p>

        <div className="mono mt-10 flex gap-1 text-[12px]" role="group" aria-label="Rounds">
          {golfRounds.map((r, i) => (
            <button
              key={r.id}
              type="button"
              aria-pressed={i === idx}
              onClick={() => go(i)}
              className={`rounded-full px-3 py-1.5 transition-colors ${i === idx ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"}`}
            >
              {cleared[r.id] != null ? "✓ " : ""}hole {i + 1}
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-[6px] border border-rule bg-card">
          <div className="mono flex justify-between border-b border-dashed border-rule px-5 py-3 text-[11.5px] text-graphite">
            <span>
              hole {idx + 1} · par {round.par}
            </span>
            <span>{words}w</span>
          </div>
          <div className="space-y-5 p-5">
            <div>
              <p className="text-ink">{round.instruction}</p>
              <p className="mono mt-2 rounded-[4px] border border-rule bg-paper px-3 py-2 text-[13px] text-ink">
                {round.target}
              </p>
            </div>
            <label className="mono flex items-start gap-2 text-[13px]">
              <span className="pt-[3px] text-kesari">›</span>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && prompt.trim())
                    mutation.mutate({ prompt, roundId: round.id });
                }}
                rows={2}
                maxLength={600}
                placeholder="your prompt…"
                aria-label="Your prompt"
                className="w-full resize-none bg-transparent text-ink outline-none placeholder:text-graphite"
              />
            </label>
            <div className="mono flex flex-wrap items-center gap-4 text-[12px]">
              <button
                type="button"
                disabled={!prompt.trim() || mutation.isPending}
                onClick={() => mutation.mutate({ prompt, roundId: round.id })}
                className="press rounded-[5px] bg-ink px-3 py-1.5 text-paper transition-opacity disabled:opacity-40"
              >
                {mutation.isPending ? "swinging…" : "swing ↵"}
              </button>
              <button type="button" onClick={() => setHint((h) => !h)} className="text-graphite hover:text-ink">
                hint
              </button>
              <span className="text-graphite">ctrl/⌘ + enter</span>
            </div>
            {hint && <p className="hand text-[13px]">{round.hint}</p>}

            {(result || mutation.isError || mutation.isPending) && (
              <div className="border-t border-dashed border-rule pt-4" aria-live="polite">
                {mutation.isPending && <p className="mono text-[12.5px] text-graphite">running…</p>}
                {mutation.isError && (
                  <p className="mono text-[12.5px] text-kesari-ink">{(mutation.error as Error).message}</p>
                )}
                {result && (
                  <div className="space-y-3">
                    <p className="mono text-[11px] text-graphite">the model said</p>
                    <p className="mono rounded-[4px] border border-rule bg-paper px-3 py-2 text-[13px] whitespace-pre-wrap text-ink">
                      {result.output || "(nothing)"}
                    </p>
                    <p className="mono flex justify-between text-[12px]">
                      {result.matched ? (
                        <span className="text-kesari-ink">
                          {score(result.words, round.par)} · {result.words} words
                        </span>
                      ) : (
                        <span className="text-graphite">not quite; tweak it and swing again</span>
                      )}
                      <span className="text-graphite">{result.latencyMs} ms</span>
                    </p>
                    {result.matched && idx < golfRounds.length - 1 && (
                      <button
                        type="button"
                        className="mono text-[12px] text-ink hover:text-kesari-ink"
                        onClick={() => go(idx + 1)}
                      >
                        next hole →
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
