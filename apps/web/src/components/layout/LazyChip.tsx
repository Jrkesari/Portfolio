import { useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { openTldr, useOverlay } from "@/lib/ui";

// For the reader who doesn't want the slow version. Appears once the hero is
// behind you, offers itself for a few seconds, then gets out of the way.

export function LazyChip() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const overlay = useOverlay();
  const [show, setShow] = useState(false);
  const [spent, setSpent] = useState(false);

  useEffect(() => {
    if (!show || spent) return;
    const t = window.setTimeout(() => setSpent(true), 9000);
    return () => window.clearTimeout(t);
  }, [show, spent]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const nearEnd = window.innerHeight + y > document.documentElement.scrollHeight - 700;
      setShow(y > window.innerHeight * 0.9 && !nearEnd);
      if (y < 40) setSpent(false); // back at the top: it may offer itself again
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  if (pathname !== "/") return null;
  const visible = show && !spent && overlay === null;
  return (
    <button
      type="button"
      onClick={(e) => openTldr(e.currentTarget)}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`press no-print mono fixed right-[4.25rem] bottom-5 z-40 flex items-center gap-2 rounded-full border border-rule bg-paper/90 px-3.5 py-2 text-[11.5px] text-ink-2 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-[opacity,transform] duration-500 ease-lazy hover:text-ink ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <span aria-hidden className="text-kesari">
        ●
      </span>
      too lazy to scroll? <span className="text-ink underline decoration-kesari underline-offset-4">tl;dr</span>
    </button>
  );
}
