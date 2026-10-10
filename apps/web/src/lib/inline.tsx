import { Link } from "@tanstack/react-router";
import { Fragment, type ReactNode } from "react";
import { Scribble } from "@/components/Scribble";

// Tiny inline formatter for content strings: **bold**, *italic*, `code`,
// [text](href) and ==a hand-drawn underline==. Enough for prose kept in TypeScript files,
// without pulling in a markdown pipeline.

const TOKEN = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|==[^=]+==)/g;

export function inline(text: string): ReactNode {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return (
        <strong key={i} className="font-medium text-ink">
          {inline(p.slice(2, -2))}
        </strong>
      );
    if (p.startsWith("==") && p.endsWith("=="))
      return (
        <Scribble key={i} delay={900}>
          {inline(p.slice(2, -2))}
        </Scribble>
      );
    if (p.startsWith("*") && p.endsWith("*")) return <em key={i}>{inline(p.slice(1, -1))}</em>;
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={i} className="mono rounded-[3px] bg-paper-2 px-[0.3em] py-[0.05em] text-[0.82em] text-ink">
          {p.slice(1, -1)}
        </code>
      );
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(p);
    if (link?.[2].startsWith("/")) {
      // Internal: through the router, so the page doesn't reload.
      const [to, hash] = link[2].split("#");
      return (
        <Link key={i} className="link" to={to} hash={hash}>
          {link[1]}
        </Link>
      );
    }
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a
          key={i}
          className="link"
          href={link[2]}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}
