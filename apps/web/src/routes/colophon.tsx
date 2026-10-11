import { inspirations, site } from "@jrk/content";
import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { PageHead } from "@/components/PageHead";
import { Seo } from "@/components/Seo";

export const Route = createFileRoute("/colophon")({
  component: Colophon,
});

const versions = [
  { when: "2026-10", v: "v3", what: "warm paper, ASCII figures, a monorepo", here: true },
  { when: "2026-06", v: "v2.5", what: "warm paper, a game, an animated mascot" },
  { when: "2026-03", v: "v2", what: "minimal, white, a list of projects" },
  { when: "2024-09", v: "v1", what: "MS-DOS terminal, a Commodore 64 in the hero" },
];

const rows: { k: string; v: ReactNode }[] = [
  {
    k: "Diagrams",
    v: (
      <>
        Every figure is plain text: the box-drawing I already use in READMEs. A small parser in{" "}
        <code className="mono text-[0.85em]">packages/ascii</code> finds the boxes, traces the lines between them, and
        treats arrowheads as one-way so two parallel lines stay two paths. The renderer lights a path and steps a packet
        down it, one character at a time. Tests check that every figure on the site names boxes that exist and lines
        that are drawn.
      </>
    ),
  },
  {
    k: "Type",
    v: (
      <>
        Newsreader by Production Type for reading. Monaspace Xenon and Radon by GitHub Next for diagrams and margin
        notes: subset, renamed per their licence, and kept whole for box-drawing glyphs that the usual web subsets drop.
      </>
    ),
  },
  {
    k: "Colour",
    v: (
      <>
        Khadi paper. Neel, indigo, for the things in a system; kesari, saffron and my surname, for what moves through
        them. Kept that way on purpose: cream, a rust accent and a big italic serif are what generated sites default to
        this year.
      </>
    ),
  },
  {
    k: "Motion",
    v: (
      <>
        Slow on purpose. A long, soft scroll (Lenis), things that print rather than pop, CSS scroll-driven animations
        and view transitions where the browser supports them. Ask your system for reduced motion and almost all of it
        stops.
      </>
    ),
  },
  {
    k: "Stack",
    v: (
      <>
        Turborepo and pnpm; Vite, React 19, TanStack Router and Query, Tailwind CSS 4, cmdk, Lenis. Animations are CSS
        wherever they can be; the packets and the slow scroll are a little JavaScript. Hosted on Vercel.
      </>
    ),
  },
  {
    k: "Tracking",
    v: (
      <>
        None. No analytics, no cookies, no third-party scripts, and no third-party requests from your browser: the
        GitHub numbers are fetched when the site is built.
      </>
    ),
  },
  {
    k: "For machines",
    v: (
      <>
        <a className="link" href="/llms.txt">
          /llms.txt
        </a>{" "}
        and a{" "}
        <a className="link" href="/resume.json">
          JSON résumé
        </a>
        , generated from the same content as these pages.
      </>
    ),
  },
  { k: "Keys", v: <>⌘K or ctrl+K for everything · t for the tl;dr · z to let the page doze off.</> },
  {
    k: "Built with",
    v: (
      <>
        Claude Code. I set the direction, the taste and the rules; Claude ran the research pass and wrote much of the
        code. Every number about my work was checked against the repository it came from before it went up. And the
        sentences are mine to answer for.
      </>
    ),
  },
];

function Colophon() {
  const groups = [...new Set(inspirations.map((i) => i.group))];
  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <Seo
        title="Colophon · Jayesh Ranjan Kesari"
        description="How this site is made: every version of it, the stack, the fonts, the ASCII figures and the rules it keeps for speed and privacy."
        path="/colophon"
        crumbs={[{ name: "Colophon", path: "/colophon" }]}
      />
      <PageHead
        label="colophon"
        title="How this site is made"
        lede={
          <>
            The fourth version. The source is{" "}
            <a className="link" href={site.repo} target="_blank" rel="noopener noreferrer">
              on GitHub
            </a>
            .
          </>
        }
      />

      <section
        aria-label="Versions of this site"
        className="reveal mt-14 rounded-[6px] border border-rule bg-card/60 p-6"
      >
        <ol className="mono space-y-1.5 text-[12.5px] leading-[1.6]">
          {versions.map((r) => (
            <li key={r.v} className="grid grid-cols-[4.5rem_2.6rem_minmax(0,1fr)] gap-x-3">
              <span className="text-graphite">{r.when}</span>
              <span className={r.here ? "text-neel" : "text-ink"}>{r.v}</span>
              <span className="text-ink-2">
                {r.what}
                {r.here && <span className="hand ml-2 text-[13px] sm:whitespace-nowrap">← you are here</span>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      <dl className="mt-14">
        {rows.map((r) => (
          <div key={r.k} className="reveal grid gap-3 border-t border-rule py-8 md:grid-cols-[11rem_minmax(0,1fr)]">
            <dt className="label pt-1.5">{r.k}</dt>
            <dd className="m-0 max-w-[42rem] text-ink-2">{r.v}</dd>
          </div>
        ))}
      </dl>

      {inspirations.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-[2rem] leading-tight font-light tracking-[-0.025em]">
            Sites that taught me something
          </h2>
          <p className="mt-3 max-w-[40rem] text-ink-2">
            Before this rebuild, a research pass with Claude read 257 personal sites: people at AI labs, design
            engineers, people who explain systems for a living, builders here in India. These {inspirations.length}{" "}
            changed something on this one. What I took from each, in one line:
          </p>
          <div className="mt-10 space-y-12">
            {groups.map((g) => (
              <div key={g}>
                <p className="label mb-4">{g}</p>
                <ul className="divide-y divide-rule border-y border-rule">
                  {inspirations
                    .filter((i) => i.group === g)
                    .map((i) => (
                      <li key={i.url} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:gap-6">
                        <a className="link text-ink" href={i.url} target="_blank" rel="noopener noreferrer">
                          {i.person}
                        </a>
                        <span className="text-[0.95rem] text-ink-2">{i.what}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
