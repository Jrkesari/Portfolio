import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";

// An animated, interactive agent mascot for the hero. A friendly bot that
// floats, blinks, and "speaks" — cycling through short phrases in a typed
// speech bubble. Click it and it waves, jumps, and says something new.
// On-brand (it's an "agent"). Respects prefers-reduced-motion.

const PHRASES = [
  "hi, i'm Jayesh's agent 👋",
  "i route tasks to the right tool…",
  "i can read docs, browse, query SQL…",
  "scroll down — let's play a game 🎯",
  "built with LangGraph + MCP.",
];

const CLICK_PHRASES = [
  "hey! that tickles 😄",
  "wanna see my best trick? play Prompt Golf ↓",
  "i'm built on a 14B model, btw.",
  "click me again, i dare you 😏",
  "Jayesh ships agents for a living.",
  "beep boop — that's robot for 'hire him'.",
];

export function HeroBot() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [override, setOverride] = useState<string | null>(null);
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [waving, setWaving] = useState(false);
  const reduced = useRef(false);
  const bob = useAnimationControls();

  const currentPhrase = override ?? PHRASES[phraseIdx];

  useEffect(() => {
    reduced.current =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced.current) {
      setTyped(PHRASES[0]);
      setDone(true);
    } else {
      bob.start({ y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } });
    }
  }, []);

  // Typing loop (re-runs whenever the phrase changes — rotation or click)
  useEffect(() => {
    if (reduced.current) return;
    let cancelled = false;
    setTyped("");
    setDone(false);

    let c = 0;
    const typer = setInterval(() => {
      if (cancelled) return;
      c++;
      setTyped(currentPhrase.slice(0, c));
      if (c >= currentPhrase.length) {
        clearInterval(typer);
        setDone(true);
      }
    }, 45);

    // Only auto-advance when NOT showing a click override.
    let hold: ReturnType<typeof setTimeout> | undefined;
    if (override === null) {
      hold = setTimeout(
        () => !cancelled && setPhraseIdx((p) => (p + 1) % PHRASES.length),
        currentPhrase.length * 45 + 2400,
      );
    } else {
      // After a click phrase finishes + pause, hand back to the rotation.
      hold = setTimeout(() => !cancelled && setOverride(null), currentPhrase.length * 45 + 2600);
    }

    return () => {
      cancelled = true;
      clearInterval(typer);
      if (hold) clearTimeout(hold);
    };
  }, [phraseIdx, override]);

  function handleClick() {
    if (reduced.current) return;
    setWaving(true);
    setTimeout(() => setWaving(false), 900);
    // little jump
    bob.start({
      y: [0, -26, 0],
      transition: { duration: 0.5, ease: "easeOut" },
    }).then(() => {
      if (!reduced.current)
        bob.start({ y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } });
    });
    // say something new (different from current)
    const next = CLICK_PHRASES[Math.floor(Math.random() * CLICK_PHRASES.length)];
    setOverride(next === override ? CLICK_PHRASES[(CLICK_PHRASES.indexOf(next) + 1) % CLICK_PHRASES.length] : next);
  }

  return (
    <div className="relative flex flex-col items-center justify-center select-none py-4">
      {/* Speech bubble */}
      <div className="relative mb-6 min-h-[58px] w-full max-w-[290px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhrase}
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="rounded-2xl rounded-bl-sm bg-[#171717] text-[#F5F1EA] px-4 py-3 text-sm leading-snug shadow-lg"
          >
            <span className="font-mono">
              {typed}
              {!done && (
                <span className="inline-block w-[6px] h-[14px] bg-[#F5F1EA] ml-0.5 align-middle animate-pulse" />
              )}
            </span>
            <span className="absolute -bottom-1.5 left-7 w-3 h-3 bg-[#171717] rotate-45" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* The bot — clickable */}
      <motion.button
        type="button"
        onClick={handleClick}
        animate={bob}
        whileHover={reduced.current ? undefined : { scale: 1.04 }}
        whileTap={reduced.current ? undefined : { scale: 0.97 }}
        className="relative cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#171717] rounded-2xl"
        aria-label="Pet the agent bot"
        title="click me!"
      >
        <Bot waving={waving} />
        <motion.div
          animate={reduced.current ? {} : { scaleX: [1, 0.82, 1], opacity: [0.25, 0.15, 0.25] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mt-3 h-2 w-28 rounded-full bg-[#171717] blur-md"
        />
      </motion.button>

      {/* hint */}
      <p className="mt-4 font-mono text-[11px] text-muted">↑ click the bot</p>
    </div>
  );
}

function Bot({ waving }: { waving: boolean }) {
  return (
    <svg width="190" height="190" viewBox="0 0 190 190" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* antenna */}
      <line x1="95" y1="34" x2="95" y2="18" stroke="#171717" strokeWidth="3" strokeLinecap="round" />
      <motion.circle
        cx="95" cy="13" r="6" fill="#27c93f"
        animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* head */}
      <rect x="42" y="34" width="106" height="86" rx="26" fill="#FBF9F4" stroke="#171717" strokeWidth="3.5" />
      {/* ears */}
      <rect x="32" y="62" width="10" height="30" rx="5" fill="#171717" />
      <rect x="148" y="62" width="10" height="30" rx="5" fill="#171717" />
      {/* face screen */}
      <rect x="58" y="50" width="74" height="54" rx="16" fill="#171717" />

      {/* eyes — blink; widen happily when waving */}
      <motion.g
        animate={waving ? { scaleY: 1 } : { scaleY: [1, 1, 0.1, 1, 1] }}
        transition={waving ? { duration: 0.2 } : { duration: 4, repeat: Infinity, times: [0, 0.45, 0.5, 0.55, 1] }}
        style={{ transformOrigin: "center", transformBox: "fill-box" } as any}
      >
        <circle cx="80" cy="77" r={waving ? 9 : 8} fill="#F5F1EA" />
        <circle cx="110" cy="77" r={waving ? 9 : 8} fill="#F5F1EA" />
        <motion.circle cx="82" cy="78" r="3" fill="#171717"
          animate={{ cx: [82, 78, 84, 82], cy: [78, 76, 79, 78] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
        <motion.circle cx="112" cy="78" r="3" fill="#171717"
          animate={{ cx: [112, 108, 114, 112], cy: [78, 76, 79, 78] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
      </motion.g>

      {/* body */}
      <rect x="56" y="124" width="78" height="46" rx="16" fill="#FBF9F4" stroke="#171717" strokeWidth="3.5" />
      <motion.circle cx="95" cy="147" r="7" fill="#171717"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />

      {/* left arm */}
      <motion.line x1="56" y1="138" x2="38" y2="150"
        stroke="#171717" strokeWidth="3.5" strokeLinecap="round"
        animate={{ rotate: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "56px 138px" }} />

      {/* right arm — WAVES on click, idles otherwise */}
      <motion.line x1="134" y1="138" x2="152" y2="150"
        stroke="#171717" strokeWidth="3.5" strokeLinecap="round"
        animate={waving ? { rotate: [0, -55, -20, -55, 0] } : { rotate: 0 }}
        transition={waving ? { duration: 0.85, ease: "easeInOut" } : { duration: 0.3 }}
        style={{ transformOrigin: "134px 138px" }} />
    </svg>
  );
}
