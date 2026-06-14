import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Terminal, CornerDownLeft, RotateCcw, Lightbulb, Trophy, ChevronRight } from "lucide-react";
import { golfRounds } from "@/data/promptGolf";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

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
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Something went wrong.");
  return data as SwingResult;
}

function scoreLabel(words: number, par: number): { text: string; tone: string } {
  const d = words - par;
  if (d <= -2) return { text: "Eagle", tone: "text-green-700" };
  if (d === -1) return { text: "Birdie", tone: "text-green-700" };
  if (d === 0) return { text: "Par", tone: "text-[#171717]" };
  if (d === 1) return { text: "Bogey", tone: "text-muted" };
  return { text: `+${d}`, tone: "text-muted" };
}

export function PromptGolf() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [prompt, setPrompt] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [cleared, setCleared] = useState<Record<string, number>>({});

  const round = golfRounds[roundIdx];

  const mutation = useMutation({
    mutationFn: swing,
    onSuccess: (data) => {
      if (data.matched) {
        setCleared((prev) => {
          const best = prev[round.id];
          return { ...prev, [round.id]: best == null ? data.words : Math.min(best, data.words) };
        });
      }
    },
  });

  const result = mutation.data;
  const isWin = result?.matched ?? false;

  function handleSwing() {
    if (!prompt.trim() || mutation.isPending) return;
    setShowHint(false);
    mutation.mutate({ prompt, roundId: round.id });
  }

  function goToRound(idx: number) {
    setRoundIdx(idx);
    setPrompt("");
    setShowHint(false);
    mutation.reset();
  }

  function reset() {
    setPrompt("");
    setShowHint(false);
    mutation.reset();
  }

  const clearedCount = Object.keys(cleared).length;

  return (
    <section id="play" className="py-16 px-6 border-t border-border">
      <div className="max-w-content mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-6"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-end justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-muted">01</span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-[#171717]">
                Prompt Golf
              </h2>
            </div>
            <span className="font-mono text-xs text-muted">
              {clearedCount}/{golfRounds.length} cleared
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm text-muted leading-relaxed max-w-lg">
            A tiny prompt-engineering game. Write the{" "}
            <span className="text-[#171717] font-medium">shortest</span> prompt that makes a real
            LLM produce the target output. Fewer words wins — like golf. Runs live on{" "}
            <span className="font-mono text-xs">Ministral-14B</span>.
          </motion.p>

          {/* Round tabs */}
          <motion.div variants={fadeUp} className="flex items-center gap-1">
            {golfRounds.map((r, i) => {
              const done = cleared[r.id] != null;
              return (
                <button
                  key={r.id}
                  onClick={() => goToRound(i)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    i === roundIdx
                      ? "bg-[#171717] text-[#F7F4EE]"
                      : "text-muted hover:text-[#171717]"
                  }`}
                >
                  {done ? "✓ " : ""}
                  {i + 1}
                </button>
              );
            })}
          </motion.div>

          {/* Terminal card */}
          <motion.div
            variants={fadeUp}
            className="rounded-lg border border-border bg-cream overflow-hidden"
          >
            {/* Goal bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface">
              <Terminal size={13} className="text-muted" />
              <span className="font-mono text-xs text-muted">
                round {roundIdx + 1} · par {round.par}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Objective */}
              <div className="space-y-1.5">
                <p className="text-sm text-gray-900 leading-relaxed">{round.instruction}</p>
                <p className="font-mono text-sm text-[#171717] bg-white border border-border rounded px-3 py-2 break-words">
                  {round.target}
                </p>
              </div>

              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-sm text-muted pt-2 select-none">&gt;</span>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSwing();
                    }}
                    rows={2}
                    maxLength={600}
                    placeholder="your prompt…"
                    className="flex-1 resize-none bg-transparent font-mono text-sm text-gray-900 placeholder:text-muted/60 focus:outline-none pt-1.5"
                    aria-label="Your prompt"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSwing}
                      disabled={!prompt.trim() || mutation.isPending}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] text-[#F7F4EE] text-xs font-medium hover:bg-[#0A0A0A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {mutation.isPending ? "swinging…" : "Swing"}
                      {!mutation.isPending && <CornerDownLeft size={12} />}
                    </button>
                    <button
                      onClick={() => setShowHint((s) => !s)}
                      className="inline-flex items-center gap-1 text-xs text-muted hover:text-[#171717] transition-colors"
                    >
                      <Lightbulb size={12} /> hint
                    </button>
                    {(result || mutation.isError) && (
                      <button
                        onClick={reset}
                        className="inline-flex items-center gap-1 text-xs text-muted hover:text-[#171717] transition-colors"
                      >
                        <RotateCcw size={12} /> clear
                      </button>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted">
                    {prompt.trim() ? `${prompt.trim().split(/\s+/).length}w` : "0w"}
                  </span>
                </div>

                {showHint && (
                  <p className="text-xs text-muted leading-relaxed pl-5">{round.hint}</p>
                )}
              </div>

              {/* Output */}
              {(result || mutation.isPending || mutation.isError) && (
                <div className="pt-1 border-t border-border space-y-2">
                  {mutation.isPending && (
                    <p className="font-mono text-sm text-muted pt-3 animate-pulse">running…</p>
                  )}

                  {mutation.isError && (
                    <p className="font-mono text-sm text-muted pt-3">
                      {(mutation.error as Error)?.message || "Something went wrong."}
                    </p>
                  )}

                  {result && (
                    <div className="pt-3 space-y-2">
                      <p className="font-mono text-xs text-muted">AI replied:</p>
                      <p className="font-mono text-sm text-gray-900 bg-white border border-border rounded px-3 py-2 whitespace-pre-wrap break-words">
                        {result.output || "(empty)"}
                      </p>
                      <div className="flex items-center justify-between pt-0.5">
                        {isWin ? (
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700">
                            <Trophy size={14} />
                            {scoreLabel(result.words, round.par).text} · {result.words} words
                          </span>
                        ) : (
                          <span className="text-sm text-muted">
                            Not quite — tweak the prompt and swing again.
                          </span>
                        )}
                        <span className="font-mono text-xs text-muted">
                          {result.latencyMs}ms
                        </span>
                      </div>

                      {isWin && roundIdx < golfRounds.length - 1 && (
                        <button
                          onClick={() => goToRound(roundIdx + 1)}
                          className="inline-flex items-center gap-1 text-xs font-medium text-[#171717] hover:gap-2 transition-all pt-1"
                        >
                          next round <ChevronRight size={13} />
                        </button>
                      )}
                      {isWin && roundIdx === golfRounds.length - 1 && (
                        <p className="text-xs text-muted pt-1">
                          That's all three — you've got the prompt-engineering bug. 🏌️
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
