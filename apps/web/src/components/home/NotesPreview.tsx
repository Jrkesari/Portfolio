import { notes } from "@jrk/content";
import { Link } from "@tanstack/react-router";
import { SectionHead } from "./SectionHead";

export function NotesPreview({ n = "05" }: { n?: string }) {
  return (
    <section id="notes" className="shell py-16 md:py-24" aria-labelledby="notes-title">
      <SectionHead
        n={n}
        id="notes-title"
        kicker="notes"
        title="Written down"
        lede="Longer versions of a few of the rules, with the incidents and the numbers left in."
      />
      <div className="mt-14 grid gap-px overflow-hidden rounded-[6px] border border-rule bg-rule md:grid-cols-3">
        {notes.slice(0, 3).map((n, i) => (
          <Link
            key={n.slug}
            to="/notes/$slug"
            params={{ slug: n.slug }}
            className="reveal group flex min-h-[13rem] flex-col justify-between md:min-h-[15rem] bg-paper p-7 transition-colors duration-200 hover:bg-card focus-visible:bg-card focus-visible:outline-offset-[-4px]"
          >
            <span className="mono text-[11px] text-graphite">
              N-{String(i + 1).padStart(2, "0")} · {n.minutes} min
            </span>
            <span>
              <span
                className="block font-serif text-[1.65rem] leading-[1.1] tracking-[-0.02em] text-ink"
                style={{ viewTransitionName: `note-${n.slug}` }}
              >
                {n.title}
              </span>
              <span className="mt-3 block text-[0.98rem] leading-[1.55] text-ink-2">{n.summary}</span>
            </span>
            <span className="mono mt-6 text-[11.5px] text-graphite transition-colors group-hover:text-neel">
              read →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
