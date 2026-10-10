import { useRouter, useRouterState } from "@tanstack/react-router";
import { ReactLenis, useLenis } from "lenis/react";
import { type ReactNode, useEffect, useRef } from "react";
import { useMediaQuery, usePrefersReducedMotion } from "@/lib/hooks";
import { useOverlay } from "@/lib/ui";

// The "lazy" scroll: a long, soft lerp so the page glides a beat behind the
// wheel. Off entirely for reduced motion and on touch (native momentum wins).

function RouteSync() {
  const lenis = useLenis();
  const router = useRouter();
  const overlay = useOverlay();
  const overlayOpen = useRef(false);
  overlayOpen.current = overlay !== null;
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    // The router restores scroll itself; Lenis just needs to re-read the page.
    lenis?.resize();
  }, [pathname, lenis]);
  useEffect(
    // A glide still running from the last page must not drag the next one with it —
    // links, the palette, back and forward all come through here.
    () =>
      router.subscribe("onBeforeNavigate", () => {
        lenis?.stop();
        // …but stay stopped if an overlay is still open (back/forward behind the tl;dr).
        if (!overlayOpen.current) lenis?.start();
      }),
    [router, lenis],
  );
  useEffect(() => {
    // Nothing scrolls behind an open overlay.
    if (!lenis) return;
    if (overlay) lenis.stop();
    else lenis.start();
  }, [overlay, lenis]);
  return null;
}

/**
 * Frames only while Lenis is gliding, so a page nobody is scrolling is idle.
 * The glide starts from the wheel; anchors and the palette scroll natively.
 */
function FramesOnDemand() {
  const lenis = useLenis();
  useEffect(() => {
    if (!lenis) return;
    let id = 0;
    const tick = (t: number) => {
      lenis.raf(t);
      id = lenis.isScrolling === "smooth" ? requestAnimationFrame(tick) : 0;
    };
    const off = lenis.on("virtual-scroll", () => {
      if (id) return;
      // Lenis measures each frame from the last; after a rest, start the clock fresh
      // or the first frame swallows the whole pause and the glide snaps.
      lenis.time = 0;
      id = requestAnimationFrame(tick);
    });
    return () => {
      off();
      cancelAnimationFrame(id);
    };
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion();
  // On touch, native momentum wins and Lenis would only spin a frame loop for nothing.
  const coarse = useMediaQuery("(hover: none), (pointer: coarse)");
  if (reduced || coarse) return <>{children}</>;
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.075,
        wheelMultiplier: 0.95,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        stopInertiaOnNavigate: true,
        prevent: (node) => node.closest?.("[data-lenis-prevent], [cmdk-root], [role='dialog']") !== null,
      }}
    >
      <RouteSync />
      <FramesOnDemand />
      {children}
    </ReactLenis>
  );
}
