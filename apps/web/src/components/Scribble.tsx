import type { ReactNode } from "react";
import { useInViewOnce } from "@/lib/hooks";

// A hand-drawn underline: one wobbly stroke that draws itself in, slowly,
// the first time it's seen. The path is drawn once by hand (well, by pen
// coordinates) and stretched to the word's width.

const PATH = "M2 9.5 C 18 6.8, 34 10.6, 52 8.2 S 86 5.9, 104 8.6 S 132 10.9, 150 7.1 S 176 5.2, 198 7.8";

export function Scribble({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, seen] = useInViewOnce<HTMLSpanElement>("0px");
  return (
    <span ref={ref} className="relative inline-block whitespace-nowrap">
      {children}
      <svg
        aria-hidden
        viewBox="0 0 200 14"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.32em] left-[-2%] h-[0.5em] w-[104%] overflow-visible"
      >
        <path
          d={PATH}
          pathLength={1}
          fill="none"
          className="scribble-path stroke-kesari"
          strokeWidth="2.4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          style={{ transitionDelay: `${delay}ms` }}
          data-seen={seen}
        />
      </svg>
    </span>
  );
}
