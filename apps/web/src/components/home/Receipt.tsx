import { provenanceNote, receipt } from "@jrk/content";
import { BeforeAfter } from "@/components/Ticker";
import { useInViewOnce } from "@/lib/hooks";
import { SectionHead } from "./SectionHead";

// A thermal-paper receipt that feeds out line by line when it scrolls into view.

const BARCODE = "▌▍█▏▌▋▏█▍▌▏▊▍▏█▌▍▏▋█▏▍▌█▏▍▊▌▏█▍";

export function Receipt({ n = "04" }: { n?: string }) {
  const [ref, seen] = useInViewOnce<HTMLDivElement>("0px 0px -20% 0px");
  const rows = receipt.lines.length + receipt.footer.length + 9;

  return (
    <section id="numbers" className="shell py-16 md:py-24" aria-labelledby="numbers-title">
      <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-20">
        <div>
          <SectionHead
            n={n}
            id="numbers-title"
            kicker="receipts"
            title="What it added up to"
            lede="A number without a source is decoration. Every line on the receipt says where it came from. Most of those sources live in my employer's private repositories. I can walk you through any of them, but not hand them over."
          />
          <dl className="mono mt-10 max-w-[30rem] space-y-3 text-[12px] text-ink-2">
            {Object.entries(provenanceNote).map(([tag, note]) => (
              <div key={tag} className="reveal grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3">
                <dt>
                  <span className="tag">{tag}</span>
                </dt>
                <dd className="m-0 text-graphite">{note.split(": ")[1]}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div ref={ref} className="receipt-wrap" style={{ ["--rows" as string]: rows }}>
          <div className={`receipt ${seen ? "is-printing" : ""}`}>
            <div className="text-center">
              <p className="tracking-[0.3em]">JRK · ENGINEERING</p>
              <p className="text-graphite">NOIDA, IN · OCT 2026</p>
              <p className="text-graphite">ORDER #0001 · TABLE: LAPTOP</p>
            </div>
            <p aria-hidden className="receipt-rule" />
            <div role="table" aria-label="Numbers, and where each one came from">
              <div role="rowgroup">
                {receipt.lines.map((l, i) => (
                  // biome-ignore lint/a11y/useFocusableInteractive: a row in a static table, not a grid widget
                  <div key={l.label} role="row" className="receipt-line">
                    <span role="cell" className="receipt-label">
                      {l.label}
                    </span>
                    <span aria-hidden className="receipt-dots" />
                    <span role="cell" className="text-ink tabular-nums">
                      {/* Counts while its line prints: the header is four rows, then one row per line. */}
                      <BeforeAfter value={l.value} start={seen} delay={(i + 4) * 120} />
                    </span>
                    <span role="cell" className="receipt-src" title={provenanceNote[l.source]}>
                      {l.source}
                    </span>
                  </div>
                ))}
              </div>
              <p aria-hidden className="receipt-rule" />
              <div role="rowgroup">
                {receipt.footer.map((l) => (
                  // biome-ignore lint/a11y/useFocusableInteractive: a row in a static table, not a grid widget
                  <div key={l.label} role="row" className="receipt-line">
                    <span role="cell" className="receipt-label uppercase">
                      {l.label}
                    </span>
                    <span aria-hidden className="receipt-dots" />
                    <span role="cell" className="text-ink">
                      {l.value}
                    </span>
                    <span role="cell" className="receipt-src" title={provenanceNote[l.source]}>
                      {l.source}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p aria-hidden className="receipt-rule" />
            <p className="text-center">THANK YOU · ASK ME ABOUT ANY LINE</p>
            <p
              aria-hidden
              className="mt-2 overflow-hidden text-center text-[20px] leading-none tracking-[-0.05em] text-ink whitespace-nowrap"
            >
              {BARCODE}
            </p>
            <p aria-hidden className="text-center text-[10px] text-graphite">
              no tokens were estimated in the making of this receipt
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
