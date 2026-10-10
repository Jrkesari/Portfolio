import { type Rule, rules, ruleThemes, systems } from "@jrk/content";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { inline } from "@/lib/inline";
import { SectionHead } from "./SectionHead";

type Filter = Rule["theme"] | "all";

interface Props {
  /** The section's number on its page. */
  n?: string;
  /** Only these rules, in this order, without the theme filter: the home page's short version. */
  ids?: string[];
}

export function RulesLog({ n = "01", ids }: Props) {
  const short = ids !== undefined;
  const pool = short ? ids.flatMap((id) => rules.filter((r) => r.id === id)) : rules;
  const [filter, setFilter] = useState<Filter>("all");
  // The full log opens on its first rule; the short version starts closed, so it stays short.
  const [open, setOpen] = useState<string | null>(short ? null : (rules[0]?.id ?? null));
  const shown = filter === "all" ? pool : pool.filter((r) => r.theme === filter);
  const themes = Object.keys(ruleThemes) as Rule["theme"][];
  const sectionId = short ? "thinking" : "rules";

  return (
    <section id={sectionId} className="shell py-16 md:py-24" aria-labelledby={`${sectionId}-title`}>
      <SectionHead
        n={n}
        id={`${sectionId}-title`}
        kicker="how I think"
        title="Rules I work by"
        lede={
          short
            ? `Each one is a rule plus the thing that happened to produce it. Here are ${pool.length} of the ${rules.length}; the rest, and how I structure a repository, have a page of their own.`
            : "Each one is a rule plus the thing that happened to produce it. I keep them in a decision log next to the code. These are the ones I'd defend at a whiteboard."
        }
      />

      {!short && (
        <div
          className="mono mt-10 flex flex-wrap gap-x-1 gap-y-2 text-[12px]"
          role="group"
          aria-label="Filter rules by theme"
        >
          {(["all", ...themes] as Filter[]).map((t) => {
            const count = t === "all" ? rules.length : rules.filter((r) => r.theme === t).length;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={filter === t}
                onClick={() => setFilter(t)}
                className={`press rounded-full px-3 py-1.5 transition-colors duration-200 ${
                  filter === t ? "bg-ink text-paper" : "text-ink-2 hover:text-ink"
                }`}
              >
                {t === "all" ? "all" : ruleThemes[t]}{" "}
                <span className={filter === t ? "text-paper/70" : "text-graphite"}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      <ol className={`${short ? "mt-12" : "mt-8"} border-t border-rule`}>
        {shown.map((r) => {
          const n = rules.indexOf(r) + 1;
          const isOpen = open === r.id;
          const sys = systems.find((s) => s.slug === r.from);
          return (
            <li key={r.id} className="border-b border-rule">
              <h3 className="m-0">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`rule-${r.id}`}
                  onClick={() => setOpen(isOpen ? null : r.id)}
                  className="group grid w-full grid-cols-[3.2rem_minmax(0,1fr)_auto] items-baseline gap-x-3 py-6 text-left"
                >
                  <span className="mono text-[11.5px] tabular-nums text-graphite">R-{String(n).padStart(2, "0")}</span>
                  <span className="font-serif text-[1.35rem] leading-snug tracking-[-0.015em] text-ink sm:text-[1.6rem]">
                    {r.rule}
                  </span>
                  <span className="mono flex items-baseline gap-3 text-[11px] text-graphite">
                    <span className="hidden md:inline">{ruleThemes[r.theme]}</span>
                    <span
                      aria-hidden
                      className={`inline-block text-[15px] transition-transform duration-200 ease-lazy ${isOpen ? "rotate-45 text-kesari" : "group-hover:text-ink"}`}
                    >
                      +
                    </span>
                  </span>
                </button>
              </h3>
              <div id={`rule-${r.id}`} className="disclosure" data-open={isOpen} inert={!isOpen}>
                <div>
                  <div className="grid gap-6 pb-9 pl-[3.95rem] md:grid-cols-2 md:gap-10">
                    <div>
                      <p className="label mb-2">what happened</p>
                      <p className="text-[1rem] leading-[1.6] text-ink-2">{inline(r.incident)}</p>
                    </div>
                    <div>
                      <p className="label mb-2">what I do now</p>
                      <p className="text-[1rem] leading-[1.6] text-ink-2">{inline(r.practice)}</p>
                    </div>
                    {(r.result || sys) && (
                      <p className="hand text-[13.5px] leading-[1.55] md:col-span-2">
                        {r.result && (
                          <>
                            <span className="text-kesari">∴ </span>
                            {inline(r.result)}
                          </>
                        )}
                        {sys && (
                          <Link
                            to="/work/$slug"
                            params={{ slug: sys.slug }}
                            className="mono ml-3 text-[11px] whitespace-nowrap text-graphite not-italic hover:text-ink"
                          >
                            from {sys.name.toLowerCase()} →
                          </Link>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      {short && (
        <p className="mt-8">
          <Link to="/thinking" className="link mono text-[12.5px]">
            all {rules.length} rules, and how I structure work →
          </Link>
        </p>
      )}
    </section>
  );
}
