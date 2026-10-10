import { type ErrorComponentProps, Link } from "@tanstack/react-router";

/** A page that throws stays inside the site — header, footer and a way out. */
export function RouteError({ error, reset }: ErrorComponentProps) {
  return (
    <main className="shell min-h-[70vh] pt-40">
      <p className="label mb-6">error</p>
      <h1 className="font-serif text-5xl font-light tracking-[-0.03em]">This page tripped over itself.</h1>
      <p className="mt-4 max-w-[38rem] text-ink-2">
        Not your fault. Try it again, or{" "}
        <Link to="/" className="link">
          go home
        </Link>
        .
      </p>
      <p className="mono mt-6 text-[12px] text-graphite">{String((error as Error)?.message ?? error).slice(0, 160)}</p>
      <button type="button" className="link mono mt-6 text-[12px]" onClick={reset}>
        try again
      </button>
    </main>
  );
}
