import { type CaseSection, provenanceNote, systems } from "@jrk/content";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SteppedFigure } from "@/components/ascii/SteppedFigure";
import { ReadingProgress } from "@/components/ReadingProgress";
import { absolute, author, Seo } from "@/components/Seo";
import { Ticker } from "@/components/Ticker";
import { TraceReplay } from "@/components/TraceReplay";
import { useInViewOnce } from "@/lib/hooks";
import { inline } from "@/lib/inline";

export const Route = createFileRoute("/work/$slug")({
  loader: ({ params }) => {
    const index = systems.findIndex((s) => s.slug === params.slug);
    if (index < 0) throw notFound();
    return { index };
  },
  // A different case study is a different page: its figure and replay start fresh.
  remountDeps: ({ params }) => params,
  component: CaseStudy,
});

function Section({ s, n }: { s: CaseSection; n: number }) {
  return (
    <section className="reveal grid gap-6 border-t border-rule py-12 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10">
      <h2 className="font-serif text-[1.45rem] leading-tight tracking-[-0.015em]">
        <span className="mono mb-2 block text-[12px] text-neel">§ {n}</span>
        {s.heading}
      </h2>
      <div className="max-w-[40rem] space-y-5">
        {s.paragraphs?.map((p, i) => (
          <p key={i} className="text-ink-2">
            {inline(p)}
          </p>
        ))}
        {s.bullets && (
          <ul className="space-y-4">
            {s.bullets.map((b, i) => (
              <li key={i} className="grid grid-cols-[1.1rem_minmax(0,1fr)] text-ink-2">
                <span aria-hidden className="mono pt-[3px] text-[12px] text-kesari">
                  →
                </span>
                <span>{inline(b)}</span>
              </li>
            ))}
          </ul>
        )}
        {s.rejected && (
          <dl className="divide-y divide-rule border-y border-rule">
            {s.rejected.map((r) => (
              <div key={r.option} className="grid gap-2 py-4 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-6">
                <dt className="text-ink">
                  <span className="mono mr-2 text-[11px] text-neel">✗</span>
                  <span className="decoration-kesari/60 decoration-1 line-through">{r.option}</span>
                </dt>
                <dd className="m-0 text-[0.98rem] text-ink-2">{inline(r.why)}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}

function CaseStudy() {
  const { index } = Route.useLoaderData();
  const s = systems[index];
  const prev = systems[(index - 1 + systems.length) % systems.length];
  const next = systems[(index + 1) % systems.length];
  const [metricsRef, metricsSeen] = useInViewOnce<HTMLDListElement>("0px 0px -10% 0px");

  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <Seo
        title={`${s.name} · Jayesh Ranjan Kesari`}
        description={s.oneLiner}
        path={`/work/${s.slug}`}
        type="article"
        tags={s.stack}
        graph={[
          {
            "@type": "TechArticle",
            "@id": `${absolute(`/work/${s.slug}`)}#article`,
            headline: s.name,
            description: s.oneLiner,
            abstract: s.summary,
            author,
            publisher: author,
            image: absolute("/og-image.png"),
            mainEntityOfPage: absolute(`/work/${s.slug}`),
            keywords: s.stack.join(", "),
            inLanguage: "en",
          },
        ]}
        crumbs={[{ name: s.name, path: `/work/${s.slug}` }]}
      />
      <ReadingProgress />

      <Link to="/" hash="work" className="mono text-[12px] text-graphite transition-colors hover:text-ink">
        ← all work
      </Link>

      <header className="mt-10 max-w-[52rem]">
        <p className="label">
          {s.where} <span className="text-faint">/</span> case {String(index + 1).padStart(2, "0")}
        </p>
        <h1
          className="mt-5 font-serif text-[clamp(2.6rem,7vw,5.4rem)] leading-[0.95] font-light tracking-[-0.04em]"
          style={{ viewTransitionName: `case-${s.slug}` }}
        >
          {s.name}
        </h1>
        <p className="mt-7 text-[1.25rem] leading-[1.5] text-ink md:text-[1.4rem]">{s.oneLiner}</p>
        <p className="mono mt-6 text-[12px] text-neel">{s.role}</p>
        <p className="mono mt-2 text-[12px] leading-[1.9] text-graphite">{s.stack.join(" · ")}</p>
      </header>

      {s.metrics.length > 0 && (
        <dl
          ref={metricsRef}
          className="reveal mt-14 grid grid-cols-1 border-y border-rule sm:grid-cols-2 lg:grid-cols-4"
        >
          {s.metrics.map((m) => (
            <div
              key={m.label}
              className="flex flex-col border-rule py-6 pr-6 sm:[&:not(:last-child)]:border-r sm:[&:not(:first-child)]:pl-6 max-sm:border-b max-sm:last:border-b-0"
            >
              {/* Term first for screen readers; the number still sits on top. */}
              <dt className="order-2 mt-3 text-[0.95rem] leading-snug text-ink-2">{m.label}</dt>
              <dd className="order-1 m-0 font-serif text-[1.9rem] leading-none tracking-[-0.02em] text-ink tabular-nums">
                {m.before && (
                  <>
                    <span className="text-graphite">{m.before}</span>
                    <span className="mx-1.5 text-kesari">→</span>
                  </>
                )}
                <Ticker value={m.after} from={m.before} start={metricsSeen} delay={200} />
              </dd>
              <dd className="order-3 m-0">
                {m.note && <span className="mt-1 block text-[0.85rem] leading-snug text-graphite">{m.note}</span>}
                <span className="mt-3 block">
                  <span className="tag" title={provenanceNote[m.source]}>
                    {m.source}
                  </span>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-14 max-w-[44rem] text-[1.12rem] leading-[1.65] text-ink-2">{inline(s.summary)}</p>
      {s.private && (
        <p className="hand mt-4 max-w-[44rem] text-[13px]">
          employer work: written up as architecture and decisions; client names, internal hosts and source stay private.
        </p>
      )}

      {s.diagram && (
        <figure
          className="reveal my-16 rounded-[6px] border border-rule bg-card/60 p-6 sm:p-10"
          style={{ ["--ascii-bg" as string]: "color-mix(in oklab, var(--card) 60%, var(--paper))" }}
        >
          <div className="mx-auto max-w-[60rem]">
            <SteppedFigure
              diagram={s.diagram}
              fig="fig."
              title="how it fits together"
              interval={5200}
              maxFontPx={14}
              layout="side"
            />
          </div>
        </figure>
      )}

      {s.replay && (
        <section className="reveal my-20" aria-labelledby="replay-title">
          <p className="label text-neel">try it</p>
          <h2
            id="replay-title"
            className="mt-3 font-serif text-[clamp(1.9rem,4vw,2.8rem)] leading-[1.05] font-light tracking-[-0.03em]"
          >
            {s.replay.title}
          </h2>
          <p className="mt-4 max-w-[38rem] text-ink-2">{s.replay.lede}</p>
          <TraceReplay
            diagram={s.replay.diagram}
            scenarios={s.replay.scenarios}
            chooseLabel={s.replay.choose}
            noun={s.replay.noun}
          />
        </section>
      )}

      <div className="mt-6">
        {s.sections.map((sec, i) => (
          <Section key={sec.heading} s={sec} n={i + 1} />
        ))}
      </div>

      <nav aria-label="More work" className="mt-20 grid gap-px border-y border-rule sm:grid-cols-2">
        <Link
          to="/work/$slug"
          params={{ slug: prev.slug }}
          viewTransition={{ types: ["page", "back"] }}
          className="group py-8 pr-6"
        >
          <span className="mono text-[11px] text-graphite">← previous</span>
          <span className="mt-2 block font-serif text-[1.5rem] tracking-[-0.015em] text-ink transition-transform duration-300 ease-lazy group-hover:-translate-x-1">
            {prev.name}
          </span>
        </Link>
        <Link
          to="/work/$slug"
          params={{ slug: next.slug }}
          viewTransition={{ types: ["page", "forward"] }}
          className="group py-8 text-right sm:border-l sm:border-rule sm:pl-6"
        >
          <span className="mono text-[11px] text-graphite">next →</span>
          <span className="mt-2 block font-serif text-[1.5rem] tracking-[-0.015em] text-ink transition-transform duration-300 ease-lazy group-hover:translate-x-1">
            {next.name}
          </span>
        </Link>
      </nav>
    </main>
  );
}
