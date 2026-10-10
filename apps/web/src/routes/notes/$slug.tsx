import { notes } from "@jrk/content";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NoteBody } from "@/components/NoteBody";
import { ReadingProgress } from "@/components/ReadingProgress";

export const Route = createFileRoute("/notes/$slug")({
  loader: ({ params }) => {
    const index = notes.findIndex((n) => n.slug === params.slug);
    if (index < 0) throw notFound();
    return { index };
  },
  // A different note is a different page: fresh state, not the last note's.
  remountDeps: ({ params }) => params,
  component: NotePage,
});

const fmt = (d: string) =>
  new Date(`${d}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

function NotePage() {
  const { index } = Route.useLoaderData();
  const n = notes[index];
  const next = notes[(index + 1) % notes.length];
  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <title>{`${n.title} · Jayesh Ranjan Kesari`}</title>
      <meta name="description" content={n.summary} />
      <ReadingProgress />
      <article className="mx-auto max-w-[40rem]">
        <Link to="/notes" className="mono text-[12px] text-graphite transition-colors hover:text-ink">
          ← notes
        </Link>
        <p className="label mt-10">
          note · {fmt(n.date)} · {n.minutes} min read
          {n.status === "draft" && <span className="tag ml-3 normal-case tracking-normal">draft</span>}
        </p>
        <h1
          className="mt-5 font-serif text-[clamp(2.4rem,6vw,4rem)] leading-[1] font-light tracking-[-0.035em]"
          style={{ viewTransitionName: `note-${n.slug}` }}
        >
          {n.title}
        </h1>
        <p className="mt-6 text-[1.2rem] leading-[1.55] text-ink">{n.summary}</p>
        <hr className="my-12" />
        <NoteBody blocks={n.blocks} />
        <hr className="my-14" />
        <p className="hand text-[13px]">
          written from my own design docs, commit messages and tests; the numbers are theirs.
        </p>
        {notes.length > 1 && (
          <Link to="/notes/$slug" params={{ slug: next.slug }} className="group mt-10 block">
            <span className="mono text-[11px] text-graphite">next note →</span>
            <span className="mt-2 block font-serif text-[1.6rem] tracking-[-0.02em] text-ink transition-transform duration-300 ease-lazy group-hover:translate-x-1">
              {next.title}
            </span>
          </Link>
        )}
      </article>
    </main>
  );
}
