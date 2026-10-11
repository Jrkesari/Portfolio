import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { useEffect } from "react";
import { LazyChip } from "@/components/layout/LazyChip";
import { Overlays } from "@/components/layout/Overlays";
import { ScrollJump } from "@/components/layout/ScrollJump";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { RouteError } from "@/components/RouteError";
import { Seo } from "@/components/Seo";
import { sayHello } from "@/lib/console";
import { useOverlay } from "@/lib/ui";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
  errorComponent: RouteError,
});

function RootLayout() {
  useEffect(() => sayHello(), []);
  // While the tl;dr card is up, the page behind it is out of reach — for focus and for
  // screen readers. (The palette's dialog does this itself; the screensaver is decorative.)
  const modal = useOverlay() === "tldr";
  return (
    <>
      <div inert={modal}>
        <a
          href="#main"
          className="mono sr-only z-[200] rounded bg-ink px-3 py-2 text-[12px] text-paper focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader />
        <div id="main" tabIndex={-1} className="outline-none">
          <Outlet />
        </div>
        <SiteFooter />
        <LazyChip />
        <ScrollJump />
      </div>
      <Overlays />
      <p id="route-announcer" className="sr-only" aria-live="polite" />
    </>
  );
}

function NotFound() {
  return (
    <main className="shell min-h-[70vh] pt-40">
      <Seo
        title="Not found · Jayesh Ranjan Kesari"
        description="That path doesn't route anywhere on this site."
        path="/404"
        noindex
      />
      <p className="label mb-6">404</p>
      <pre className="mono mb-8 text-[13px] leading-[1.2] text-graphite">{String.raw`┌──────────┐      ┌──────────┐
│   you    │──╳──▶│ nowhere  │
└──────────┘      └──────────┘`}</pre>
      <h1 className="font-serif text-5xl font-light tracking-[-0.03em]">That path doesn't route anywhere.</h1>
      <p className="mt-4 text-ink-2">
        Dispatch is by lookup, and this one isn't in the table.{" "}
        <Link to="/" className="link">
          Go home
        </Link>{" "}
        or press <kbd className="mono rounded border border-rule px-1 text-[12px]">⌘K</kbd>.
      </p>
    </main>
  );
}
