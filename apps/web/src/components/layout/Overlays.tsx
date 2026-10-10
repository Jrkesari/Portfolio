import { useRouterState } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { useIdle, useKey, usePrefersReducedMotion } from "@/lib/hooks";
import { loadedPalette, loadPalette, preloadPalette } from "@/lib/palette";
import { closeOverlay, openPalette, openTldr, startScreensaver, useOverlay } from "@/lib/ui";

// The always-on part of the overlays is just keys and an idle timer. The
// palette (cmdk + Radix), the tl;dr card and the screensaver load the first
// time someone asks for them.

const LazyPalette = lazy(() => loadPalette().then((m) => ({ default: m.CommandPalette })));
function CommandPalette() {
  // Chosen once per open, so a re-render can't swap it out mid-open.
  const [Palette] = useState(() => loadedPalette() ?? LazyPalette);
  return <Palette />;
}
const TldrCard = lazy(() => import("./TldrCard").then((m) => ({ default: m.TldrCard })));
const Screensaver = lazy(() => import("./Screensaver").then((m) => ({ default: m.Screensaver })));

export function Overlays() {
  const overlay = useOverlay();
  const reduced = usePrefersReducedMotion();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [atTop, setAtTop] = useState(true);

  // Once the page has settled, quietly fetch the palette.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void) => number };
    const id = w.requestIdleCallback ? w.requestIdleCallback(preloadPalette) : window.setTimeout(preloadPalette, 2500);
    return () => {
      const c = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (c.cancelIdleCallback) c.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  // ⌘K / ctrl+K anywhere, even while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Meta" || e.key === "Control") preloadPalette();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (overlay === "palette") closeOverlay();
        else openPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overlay]);

  useKey("t", () => (overlay === "tldr" ? closeOverlay() : overlay === null && openTldr()));
  useKey("z", () => (overlay === "screensaver" ? closeOverlay() : overlay === null && startScreensaver()));

  // Doze off only on the home page's first screen, after a long stillness.
  useEffect(() => {
    const onScroll = () => setAtTop(window.scrollY < 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const idle = useIdle(75_000, pathname === "/" && atTop && !reduced && overlay === null);
  useEffect(() => {
    if (idle && overlay === null) startScreensaver();
  }, [idle, overlay]);

  return (
    <Suspense fallback={null}>
      {overlay === "palette" && <CommandPalette />}
      {overlay === "tldr" && <TldrCard />}
      {overlay === "screensaver" && <Screensaver />}
    </Suspense>
  );
}
