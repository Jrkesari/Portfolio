import { useSyncExternalStore } from "react";
import { readPref, writePref } from "./hooks";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function current(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function apply(theme: Theme) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (meta) meta.content = theme === "dark" ? "#11131c" : "#f1ead8";
  for (const l of listeners) l();
}

export function setTheme(theme: Theme) {
  writePref("theme", theme);
  apply(theme); // instantly — a theme switch is a frequent action, not a moment
}

export function toggleTheme() {
  setTheme(current() === "dark" ? "light" : "dark");
}

// Follow the system until the visitor picks a side.
if (typeof window !== "undefined" && window.matchMedia) {
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!readPref("theme")) apply(e.matches ? "dark" : "light");
  });
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    current,
    () => "light",
  );
}
