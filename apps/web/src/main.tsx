import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouteError } from "./components/RouteError";
import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  defaultErrorComponent: RouteError,
  // Cross-fade between pages, but not on the first load or when only the #hash changes.
  defaultViewTransition: {
    types: ({ fromLocation, pathChanged }) => (fromLocation && pathChanged ? ["page"] : false),
  },
  scrollRestoration: true,
});

// A view transition that's interrupted (a resize, a second click) rejects promises
// nobody is waiting on. That's expected; don't report it as an error.
window.addEventListener("unhandledrejection", (e) => {
  const r = e.reason as { name?: string; message?: string } | undefined;
  if (
    r?.name === "InvalidStateError" ||
    r?.name === "AbortError" ||
    /transition was (aborted|skipped)/i.test(r?.message ?? "")
  )
    e.preventDefault();
});

// After a navigation, move focus to where the reader landed — the section for a #hash,
// otherwise the page — so the next Tab starts there, and say the new title out loud.
router.subscribe("onResolved", ({ fromLocation, toLocation, pathChanged, hashChanged }) => {
  if (!fromLocation || (!pathChanged && !hashChanged)) return;
  requestAnimationFrame(() => {
    const target = (toLocation.hash && document.getElementById(toLocation.hash)) || document.getElementById("main");
    if (!target) return;
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    const live = document.getElementById("route-announcer");
    if (live && pathChanged) live.textContent = document.title;
  });
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error("Root element not found");

createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
