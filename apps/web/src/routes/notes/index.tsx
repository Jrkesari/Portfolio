import { notes } from "@jrk/content";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Seo } from "@/components/Seo";

export const Route = createFileRoute("/notes/")({
  component: NotesIndex,
});

const fmt = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function NotesIndex() {
  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <Seo
        title="Notes · Jayesh Ranjan Kesari"
        description="Field notes on building agents: cost, safety, retrieval and the decisions behind them."
        path="/notes"
        kind="CollectionPage"
        crumbs={[{ name: "Notes", path: "/notes" }]}
      />
      <p className="label">notes</p>
      <h1 className="mt-5 max-w-[16ch] font-serif text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] font-light tracking-[-0.04em]">
        Things I wrote down so I'd stop re-learning them.
      </h1>
      <p className="mt-6 max-w-[36rem] text-ink-2">
        Each note starts from something that went wrong, or nearly did, in a system I built, and ends with the rule I
        keep because of it.
      </p>
      <ol className="mt-16 border-t border-rule">
        {notes.map((n) => (
          <li key={n.slug} className="reveal border-b border-rule">
            <Link
              to="/notes/$slug"
              params={{ slug: n.slug }}
              className="group grid gap-x-8 gap-y-2 py-8 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto]"
            >
              <span className="mono pt-2 text-[11.5px] text-graphite">{fmt(n.date)}</span>
              <span className="min-w-0">
                <span
                  className="block font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-ink transition-transform duration-300 ease-lazy group-hover:translate-x-1"
                  style={{ viewTransitionName: `note-${n.slug}` }}
                >
                  <span className="title-draw">{n.title}</span>
                </span>
                <span className="mt-2 block max-w-[40rem] text-ink-2">{n.summary}</span>
                <span className="mono mt-3 block text-[11px] text-graphite">
                  {n.tags.join(" · ")} · {n.minutes} min
                  {n.status === "draft" && <span className="tag ml-3">draft</span>}
                </span>
              </span>
              <span
                aria-hidden
                className="mono hidden pt-2 text-graphite transition-colors group-hover:text-kesari sm:block"
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
