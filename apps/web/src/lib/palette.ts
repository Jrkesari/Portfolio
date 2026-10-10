import type { ComponentType } from "react";

// The ⌘K palette (cmdk + Radix) loads on demand. Fetching it a moment early,
// when the page is idle, when a pointer nears the button, when ctrl or ⌘ goes
// down, means the first keystrokes after opening it aren't lost. Once it has
// loaded, Overlays renders it directly: React.lazy would still hold a loaded
// component back for a few hundred milliseconds behind its Suspense boundary.

let loaded: ComponentType | null = null;

export const loadPalette = () =>
  import("@/components/layout/CommandPalette").then((m) => {
    loaded = m.CommandPalette;
    return m;
  });
export const preloadPalette = () => void loadPalette();
export const loadedPalette = () => loaded;
