import { uses } from "@jrk/content";
import { createFileRoute } from "@tanstack/react-router";
import { PageHead } from "@/components/PageHead";
import { inline } from "@/lib/inline";

export const Route = createFileRoute("/uses")({
  component: Uses,
});

function Uses() {
  return (
    <main className="shell pt-32 pb-10 md:pt-40">
      <title>Uses · Jayesh Ranjan Kesari</title>
      <PageHead
        label="uses"
        title="What I work with"
        lede="The tools, and the habits around them. Nothing here is sponsored; most of it is boring on purpose."
      />
      <div className="mt-14">
        {uses.map((g) => (
          <section
            key={g.group}
            className="reveal grid gap-4 border-t border-rule py-10 md:grid-cols-[11rem_minmax(0,1fr)]"
          >
            <h2 className="label pt-1.5">{g.group}</h2>
            <dl className="max-w-[44rem] space-y-4">
              {g.items.map((it) => (
                <div key={it.name} className="grid gap-1 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-6">
                  <dt className="text-ink">{it.name}</dt>
                  <dd className="m-0 text-ink-2">{inline(it.note)}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </main>
  );
}
