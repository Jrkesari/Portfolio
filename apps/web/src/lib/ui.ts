import { useSyncExternalStore } from "react";

// A very small global store for overlays — the palette, the tl;dr card and the
// screensaver can all be opened from anywhere (keys, buttons, the palette itself).

type Overlay = "palette" | "tldr" | "screensaver" | null;

let overlay: Overlay = null;
let opener: HTMLElement | null = null;
const listeners = new Set<() => void>();

export function setOverlay(next: Overlay, from?: unknown) {
  // Remember what had focus when the first overlay opened, and hand it back on close
  // (overlays can open each other — the palette opens the tl;dr — so only the first counts).
  // `from` covers browsers where clicking a button doesn't focus it.
  if (overlay === null && next !== null) {
    const el = document.activeElement;
    const focused = el instanceof HTMLElement && el !== document.body ? el : null;
    opener = focused ?? (from instanceof HTMLElement ? from : null);
  }
  const closing = overlay !== null && next === null;
  overlay = next;
  for (const l of listeners) l();
  if (closing) {
    const el = opener;
    opener = null;
    // After the overlay unmounts — and only if nothing else (a navigation) took focus.
    requestAnimationFrame(() => {
      const now = document.activeElement;
      if (el?.isConnected && (!now || now === document.body)) el.focus({ preventScroll: true });
    });
  }
}

export const openPalette = (from?: unknown) => setOverlay("palette", from);
export const openTldr = (from?: unknown) => setOverlay("tldr", from);
export const startScreensaver = (from?: unknown) => setOverlay("screensaver", from);
export const closeOverlay = () => setOverlay(null);

export function useOverlay(): Overlay {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => overlay,
    () => null,
  );
}
