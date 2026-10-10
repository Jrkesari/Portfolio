import { now } from "@jrk/content";
import { createFileRoute } from "@tanstack/react-router";
import { Clock } from "@/components/layout/Clock";
import { PageHead } from "@/components/PageHead";
import { inline } from "@/lib/inline";

export const Route = createFileRoute("/now")({
  component: Now,
});

function List({ label, items }: { label: string; items: string[] }) {
  return (
    <section className="reveal grid gap-4 border-t border-rule py-10 md:grid-cols-[11rem_minmax(0,1fr)]">
      <h2 className="label pt-1.5">{label}</h2>
      <ul className="max-w-[40rem] space-y-4">
        {items.map((it) => (
          <li key={it} className="grid grid-cols-[1.2rem_minmax(0,1fr)] text-ink-2">
            <span aria-hidden className="mono pt-[3px] text-[12px] text-kesari">
              →
            </span>
            <span>{inline(it)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Now() {
  const updated = new Date(`${now.updated}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <title>Now · Jayesh Ranjan Kesari</title>
      <PageHead
        label={`now · updated ${updated}`}
        title="What I'm doing now"
        lede={
          <>
            A{" "}
            <a className="link" href="https://nownownow.com/about" target="_blank" rel="noopener noreferrer">
              now page
            </a>
            : what has my attention this month. In Noida it's <Clock className="mono text-[0.85em]" />.
          </>
        }
      />
      <div className="mt-14">
        <List label="building" items={now.doing} />
        <List label="thinking about" items={now.thinking} />
        <List label="off the clock" items={now.offline} />
      </div>
    </main>
  );
}
