import { hero, turnLoop } from "@jrk/content";
import type { CSSProperties } from "react";
import { SteppedFigure } from "@/components/ascii/SteppedFigure";
import { inline } from "@/lib/inline";

/** A staged entrance, once: each `.rise` line comes up 10px out of a blur, a beat after the last. */
const rise = (delay: number): { style: CSSProperties } => ({ style: { animationDelay: `${delay}ms` } });

export function Hero() {
  return (
    <section id="intro" className="shell relative pt-32 pb-12 md:pt-40 md:pb-20">
      <div className="grid items-start gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <p {...rise(50)} className="rise label mb-8 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>{hero.kicker}</span>
          </p>

          <h1 className="font-serif text-[clamp(3.1rem,8.6vw,7rem)] leading-[0.92] font-light tracking-[-0.045em] text-ink">
            <span {...rise(150)} className="rise block">
              Jayesh Ranjan
            </span>
            <span {...rise(300)} className="rise block">
              Kesari<span className="text-kesari">.</span>
            </span>
          </h1>

          <p
            {...rise(550)}
            className="rise mt-10 max-w-[33rem] text-[1.2rem] leading-[1.55] text-ink md:text-[1.32rem]"
          >
            {inline(hero.lede)}
          </p>
          <p {...rise(700)} className="rise mt-5 max-w-[33rem] text-ink-2">
            {inline(hero.sub)}
          </p>

          <div {...rise(900)} className="rise mono mt-10 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px]">
            {hero.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="group inline-flex items-baseline gap-1.5 text-ink"
              >
                <span className="border-b border-rule pb-px transition-colors group-hover:border-kesari">
                  {l.label}
                </span>
                <span
                  aria-hidden
                  className="text-graphite transition-transform duration-200 group-hover:translate-x-0.5"
                >
                  {l.href.startsWith("http") ? "↗" : "→"}
                </span>
              </a>
            ))}
          </div>
        </div>

        <div
          className="fade-late lg:pt-16"
          style={{ ["--ascii-bg" as string]: "var(--paper)", animationDelay: "500ms" }}
        >
          <SteppedFigure diagram={turnLoop} fig="fig. 1" title="a turn, roughly" maxFontPx={16} legend />
        </div>
      </div>

      <div
        className="fade-late mono mt-14 flex items-center gap-3 text-[11.5px] text-graphite"
        style={{ animationDelay: "1600ms" }}
      >
        <span aria-hidden className="inline-block motion-safe:animate-[nudge_2.8s_var(--ease-drift)_1]">
          ↓
        </span>
        <span>
          scroll, slowly. or press <kbd className="text-ink">t</kbd> if you're in a hurry.
        </span>
      </div>
    </section>
  );
}
