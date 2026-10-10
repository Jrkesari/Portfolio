import { profile, site } from "@jrk/content";
import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { closeOverlay } from "@/lib/ui";

// "Too lazy to scroll?" — the whole site on one index card.

/** Mounted (and loaded) only while open — see Overlays. */
export function TldrCard() {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Focus goes back to whatever opened the card — see setOverlay in lib/ui.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOverlay();
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <div className="no-print fixed inset-0 z-[80] grid place-items-center p-4" role="presentation">
      <button
        type="button"
        aria-label="Close"
        aria-hidden
        tabIndex={-1}
        className="absolute inset-0 cursor-default bg-ink/25 backdrop-blur-[2px] animate-[fade-in_0.2s_ease-out_both]"
        onClick={closeOverlay}
      />
      <article
        role="dialog"
        aria-modal="true"
        aria-labelledby="tldr-title"
        className="index-card relative w-full max-w-[560px] animate-[card-in_0.18s_ease-out_both] p-7 sm:p-9"
        data-lenis-prevent
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <p className="label">tl;dr · the 20 second version</p>
          <button
            ref={closeRef}
            type="button"
            onClick={closeOverlay}
            className="mono -mt-1 text-[12px] text-graphite hover:text-ink"
          >
            close ✕
          </button>
        </div>
        <h2 id="tldr-title" className="font-serif text-[2rem] leading-[1.05] tracking-[-0.02em]">
          {site.name}
        </h2>
        <p className="mt-2 text-[1.05rem] text-ink-2">{profile.tldr.line}</p>
        <ul className="mt-6 space-y-3 border-t border-dashed border-rule pt-5">
          {profile.tldr.points.map((p) => (
            <li key={p} className="flex gap-3 text-[1rem] leading-snug">
              <span aria-hidden className="mono mt-[3px] text-[12px] text-kesari">
                →
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mono mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-dashed border-rule pt-5 text-[12px]">
          <a className="link" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <Link className="link" to="/resume" onClick={closeOverlay}>
            résumé
          </Link>
          <a className="link" href={site.socials[0].href} target="_blank" rel="noopener noreferrer">
            github
          </a>
          <a className="link" href={site.socials[1].href} target="_blank" rel="noopener noreferrer">
            linkedin
          </a>
        </div>
        <p className="hand mt-6 text-[13px]">ok, now go scroll anyway; it's nicer slowly.</p>
      </article>
    </div>
  );
}
