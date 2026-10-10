import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

// One button for the reader who'd rather not scroll: in the top half of a page it
// takes you to the bottom, in the bottom half it brings you back to the top.

type Way = "down" | "up";

export function ScrollJump() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [way, setWay] = useState<Way>("down");
  const [long, setLong] = useState(false);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setLong(max > window.innerHeight * 0.6);
      setWay(window.scrollY > max / 2 ? "up" : "down");
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    // Pages change height as they load in; measure again once they settle.
    const t = window.setTimeout(measure, 600);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.clearTimeout(t);
    };
  }, [pathname]);

  const go = () => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    const top = way === "down" ? document.documentElement.scrollHeight : 0;
    window.scrollTo({ top, behavior });
  };

  const label = way === "down" ? "Go to the bottom" : "Back to the top";
  return (
    <button
      type="button"
      onClick={go}
      aria-label={label}
      title={label}
      tabIndex={long ? 0 : -1}
      aria-hidden={!long}
      className={`press no-print mono fixed right-5 bottom-5 z-40 grid size-10 place-items-center rounded-full border border-rule bg-paper/90 text-[15px] text-ink-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-[opacity,color,border-color] duration-200 hover:border-graphite hover:text-ink ${
        long ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span
        aria-hidden
        className={`inline-block transition-transform duration-200 ease-out ${way === "up" ? "rotate-180" : ""}`}
      >
        ↓
      </span>
    </button>
  );
}
