import { practices, repoShape } from "@jrk/content";
import { useInViewOnce } from "@/lib/hooks";
import { SectionHead } from "./SectionHead";

/** Split "│   ├── api/" into its connector prefix and the name, and find which stems keep going down. */
function parse(tree: string) {
  const prefix = /^[│├└─ ]*/.exec(tree)?.[0] ?? "";
  const stems = [...prefix].flatMap((ch, i) => (ch === "│" || ch === "├" ? [i] : []));
  return { prefix, name: tree.slice(prefix.length), stems };
}

export function HowIWork({ n = "02" }: { n?: string }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>("0px 0px -15% 0px");

  return (
    <section id="structure" className="shell py-16 md:py-24" aria-labelledby="structure-title">
      <SectionHead
        n={n}
        id="structure-title"
        kicker="how I structure work"
        title="The shape I keep reaching for"
        lede="Not a framework. Habits. The same five or six decisions show up in every repository I start, because each one was learned the expensive way first."
      />

      <div className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
        <div
          ref={ref}
          className="reveal h-fit rounded-[6px] border border-rule bg-card/60 p-5 sm:p-7"
          role="figure"
          aria-label="A repository layout with what each part is for"
        >
          <ul className="mono text-[12.5px] leading-[1.2]">
            {repoShape.map((row, i) => {
              const { prefix, name, stems } = parse(row.tree);
              return (
                <li key={row.tree} className="path-row relative" data-seen={seen} style={{ ["--i" as string]: i }}>
                  {stems.map((col) => (
                    <span
                      key={col}
                      aria-hidden
                      className="absolute top-0 bottom-0 w-px bg-faint"
                      style={{ left: `calc(${col}ch + 0.5ch)` }}
                    />
                  ))}
                  <span className="relative block whitespace-pre">
                    <span aria-hidden className="text-faint">
                      {prefix}
                    </span>
                    <span className="text-ink">{name}</span>
                  </span>
                  {row.note && (
                    <span
                      className="hand relative block pt-1 pb-3 text-[12.5px] leading-[1.35]"
                      style={{ paddingLeft: `calc(${prefix.length}ch + 0.6ch)` }}
                    >
                      <span aria-hidden className="text-kesari">
                        ↳{" "}
                      </span>
                      {row.note}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {practices.map((p, i) => (
            <li key={p.title} className="reveal">
              <p className="mono text-[11px] text-graphite">P-{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-2 font-serif text-[1.35rem] leading-snug tracking-[-0.015em]">{p.title}</h3>
              <p className="mt-3 text-[0.98rem] leading-[1.6] text-ink-2">{p.body}</p>
              <p className="hand mt-3 text-[12.5px] leading-[1.5]">
                <span className="text-kesari">∴ </span>
                {p.evidence}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
