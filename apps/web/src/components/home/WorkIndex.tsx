import { AsciiDiagram } from "@jrk/ascii/react";
import { type System, systems } from "@jrk/content";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SectionHead } from "./SectionHead";

/**
 * A still pane beside the list with the figure of whichever system you're on,
 * by mouse or by keyboard. It stays put and cross-fades; nothing chases the cursor.
 */
function FigurePane({ system }: { system: System }) {
  const diagram = system.diagram;
  if (!diagram) return null;
  const step = diagram.steps[Math.min(diagram.steps.length - 1, 1)];
  return (
    <div
      className="sticky top-28 rounded-[6px] border border-rule bg-card/60 p-5"
      style={{ ["--ascii-bg" as string]: "var(--card)" }}
    >
      <p className="label mb-4 text-neel">fig. · {system.name.toLowerCase()}</p>
      <div key={system.slug} className="fade-swap">
        <AsciiDiagram
          src={diagram.src}
          aliases={diagram.aliases}
          label=""
          activeNodes={step.nodes}
          activeEdges={step.edges}
          print={false}
          maxFontPx={11}
          speed={14}
          passes={3}
        />
      </div>
    </div>
  );
}

/** `more` adds the way on to /work, where the replay and the numbers live. */
export function WorkIndex({ n = "01", more = false }: { n?: string; more?: boolean }) {
  const [active, setActive] = useState<System>(systems[0]);

  return (
    <section id="work" className="shell py-16 md:py-24" aria-labelledby="work-title">
      <SectionHead
        n={n}
        id="work-title"
        kicker="selected work"
        title="Systems I built"
        lede="Most of my work is inside a company's product, so these are written up as the architecture and the decisions. No client names, no source. Each one opens into the how and the why."
      />

      <div className="mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <ol className="border-t border-rule">
          {systems.map((s, i) => (
            <li key={s.slug} className="reveal border-b border-rule">
              <Link
                to="/work/$slug"
                params={{ slug: s.slug }}
                onMouseEnter={() => setActive(s)}
                onFocus={() => setActive(s)}
                className="group grid grid-cols-[2.2rem_minmax(0,1fr)] gap-x-4 py-6 transition-colors duration-200 hover:bg-paper-2/60 sm:grid-cols-[2.8rem_minmax(0,1fr)_auto] sm:px-3"
              >
                <span className="mono pt-[0.45rem] text-[11.5px] tabular-nums text-graphite">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span
                      className="font-serif text-[1.55rem] leading-tight tracking-[-0.02em] text-ink transition-transform duration-300 ease-lazy group-hover:translate-x-1 sm:text-[1.8rem]"
                      style={{ viewTransitionName: `case-${s.slug}` }}
                    >
                      <span className="title-draw">{s.name}</span>
                    </span>
                    <span className="mono text-[11.5px] text-graphite">{s.where}</span>
                  </span>
                  <span className="mt-2 block max-w-[46rem] text-[1rem] leading-[1.55] text-ink-2">{s.oneLiner}</span>
                  <span className="mono mt-3 block text-[11.5px] text-graphite">
                    <span className="text-neel">{s.role}</span>
                    <span className="mx-2 text-faint">·</span>
                    {s.stack.slice(0, 4).join(" · ")}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="mono hidden self-center pr-1 text-[15px] text-graphite transition-all duration-200 ease-lazy group-hover:translate-x-1 group-hover:text-kesari sm:block"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <aside aria-hidden className="hidden lg:block">
          <FigurePane system={active} />
        </aside>
      </div>
      {more && (
        <p className="mt-8">
          <Link to="/work" className="link mono text-[12.5px]">
            One of them taken apart, and what they added up to →
          </Link>
        </p>
      )}
    </section>
  );
}
