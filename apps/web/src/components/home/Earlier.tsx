import { earlier } from "@jrk/content";
import { SectionHead } from "./SectionHead";

/** Projects from before the day job, and on the side. */
export function Earlier({ n = "03" }: { n?: string }) {
  return (
    <section id="earlier" className="shell py-16 md:py-24" aria-labelledby="earlier-title">
      <SectionHead
        n={n}
        id="earlier-title"
        kicker="earlier & smaller"
        title="Before the day job"
        lede="And on the side."
      />
      <ul className="mt-12 max-w-[60rem] space-y-6 border-t border-rule pt-8">
        {earlier.map((e) => (
          <li key={e.name} className="reveal grid gap-1 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-6">
            <p className="text-ink">
              {"href" in e && e.href ? (
                <a className="link" href={e.href} target="_blank" rel="noopener noreferrer">
                  {e.name}
                </a>
              ) : (
                e.name
              )}
              <span className="mono ml-2 text-[11px] text-graphite">{e.year}</span>
            </p>
            <div>
              <p className="text-[0.98rem] leading-[1.55] text-ink-2">{e.what}</p>
              <p className="mono mt-1 text-[11px] text-graphite">{e.stack}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
