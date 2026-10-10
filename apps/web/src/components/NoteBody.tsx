import { plainText } from "@jrk/ascii";
import { AsciiDiagram } from "@jrk/ascii/react";
import type { Block } from "@jrk/content";
import { inline } from "@/lib/inline";

export function NoteBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="note-body">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{inline(b.text)}</p>;
          case "h":
            return <h2 key={i}>{b.text}</h2>;
          case "quote":
            return (
              <blockquote key={i}>
                <p>{inline(b.text)}</p>
              </blockquote>
            );
          case "list":
            return (
              <ul key={i}>
                {b.items.map((item, k) => (
                  <li key={k}>{inline(item)}</li>
                ))}
              </ul>
            );
          case "fig":
            return (
              <figure key={i} className="note-fig" style={{ ["--ascii-bg" as string]: "var(--card)" }}>
                <AsciiDiagram src={b.src} label={plainText(b.src)} maxFontPx={13} />
                <figcaption className="hand mt-4 text-[13px]">{b.caption}</figcaption>
              </figure>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
