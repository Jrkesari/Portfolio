import { toolbox } from "@jrk/content";
import { useInViewOnce } from "@/lib/hooks";
import { SectionHead } from "./SectionHead";

export function Toolbox({ n = "02" }: { n?: string }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>("0px 0px -15% 0px");
  const total = toolbox.reduce((n, d) => n + d.items.length, 0);

  return (
    <section id="toolbox" className="shell py-16 md:py-24" aria-labelledby="toolbox-title">
      <SectionHead
        n={n}
        id="toolbox-title"
        kicker="toolbox"
        title="What I reach for"
        lede="Not a list of everything I've touched. What I'd pick up tomorrow without looking anything up."
      />
      <div
        ref={ref}
        className="mt-12 overflow-x-auto rounded-[6px] border border-rule bg-card/60 p-5 sm:p-7"
        data-lenis-prevent
        // biome-ignore lint/a11y/noNoninteractiveTabindex: a scroller must be reachable by keyboard (WCAG 2.1.1)
        tabIndex={0}
        role="region"
        aria-label="Toolbox"
      >
        <p className="mono text-[12.5px] text-graphite">
          <span className="text-kesari">$</span> tree jayesh/ -L 1
        </p>
        <ul className="mono mt-3 min-w-[36rem] text-[12.5px] leading-[2.05]">
          <li className="path-row text-ink" data-seen={seen} style={{ ["--i" as string]: 0 }}>
            jayesh/
          </li>
          {toolbox.map((d, i) => (
            <li
              key={d.dir}
              className="path-row grid grid-cols-[2.6rem_6.5rem_minmax(0,1fr)]"
              data-seen={seen}
              style={{ ["--i" as string]: i + 1 }}
            >
              <span aria-hidden className={`tree-stem text-faint ${i === toolbox.length - 1 ? "is-last" : ""}`}>
                {i === toolbox.length - 1 ? "└──" : "├──"}
              </span>
              <span className="text-neel">{d.dir}/</span>
              <span className="text-ink-2">
                {d.items.map((item, k) => (
                  <span key={item}>
                    <span className="transition-colors hover:text-ink">{item}</span>
                    {k < d.items.length - 1 && <span className="text-faint"> · </span>}
                  </span>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p
          className="mono path-row mt-4 text-[12px] text-graphite"
          data-seen={seen}
          style={{ ["--i" as string]: toolbox.length + 2 }}
        >
          {toolbox.length} directories, {total} tools
        </p>
      </div>
    </section>
  );
}
