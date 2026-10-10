import { site } from "@jrk/content";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { openTldr, startScreensaver } from "@/lib/ui";
import { Clock } from "./Clock";

export function SiteFooter() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(site.email).then(
      () => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2400);
      },
      () => (window.location.href = `mailto:${site.email}`),
    );
  };

  return (
    <footer id="contact" className="no-print relative mt-32 border-t border-rule">
      <div className="shell pt-20 pb-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="label mb-6">say hello</p>
            <h2 className="font-serif text-[clamp(2.4rem,6vw,4.6rem)] leading-[0.98] font-light tracking-[-0.035em]">
              If you're building
              <br />
              agents, <span className="text-neel">write to me.</span>
            </h2>
            <p className="mt-6 max-w-md text-ink-2">
              Questions about something here, a system you're stuck on, or work: email is the fastest way to reach me.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={`mailto:${site.email}`} className="link font-serif text-[1.35rem]">
                {site.email}
              </a>
              <button
                type="button"
                onClick={copy}
                className="press mono relative rounded-[5px] border border-rule px-2.5 py-1 text-[11.5px] text-graphite transition-colors hover:border-graphite hover:text-ink"
              >
                {copied ? "copied ✓" : "copy"}
                {copied && (
                  <span aria-hidden className="stamp absolute -top-7 left-1/2 -translate-x-1/2">
                    copied
                  </span>
                )}
              </button>
              <span className="sr-only" aria-live="polite">
                {copied ? "Email address copied" : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 self-end text-[15px]">
            <div className="space-y-2">
              <p className="label mb-3">elsewhere</p>
              {site.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-baseline gap-2"
                >
                  <span className="text-ink transition-colors group-hover:text-neel">{s.label}</span>
                  <span
                    aria-hidden
                    className="mono text-[11px] text-graphite transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
              <Link to="/resume" className="group flex items-baseline gap-2">
                <span className="text-ink transition-colors group-hover:text-neel">Résumé</span>
                <span aria-hidden className="mono text-[11px] text-graphite">
                  →
                </span>
              </Link>
            </div>
            <div className="space-y-2">
              <p className="label mb-3">around here</p>
              {(
                [
                  ["/thinking", "Thinking"],
                  ["/about", "About"],
                  ["/notes", "Notes"],
                  ["/now", "Now"],
                  ["/uses", "Uses"],
                  ["/colophon", "Colophon · v3"],
                ] as const
              ).map(([to, label]) => (
                <Link key={to} to={to} className="block text-ink transition-colors hover:text-neel">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mono mt-20 flex flex-col gap-4 border-t border-rule pt-6 text-[11.5px] text-graphite md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · made in {site.city}
          </p>
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Clock verbose />
          </p>
          <p className="flex gap-4">
            <button type="button" className="hover:text-ink" onClick={(e) => openTldr(e.currentTarget)}>
              tl;dr <kbd className="text-graphite">t</kbd>
            </button>
            <button type="button" className="hover:text-ink" onClick={(e) => startScreensaver(e.currentTarget)}>
              sleep <kbd className="text-graphite">z</kbd>
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
