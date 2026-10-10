import { notes, site, systems } from "@jrk/content";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Command } from "cmdk";
import { useState } from "react";
import { setSingleKeys, singleKeysOn } from "@/lib/hooks";
import { toggleTheme } from "@/lib/theme";
import { closeOverlay, openTldr, startScreensaver } from "@/lib/ui";

type Item = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string[];
  run: () => void;
};

/** Mounted (and loaded) only while open — see Overlays. */
export function CommandPalette() {
  const navigate = useNavigate();
  const location = useLocation();
  const [copied, setCopied] = useState(false);
  const [keysOn, setKeysOn] = useState(singleKeysOn);
  const [search, setSearch] = useState("");

  const go = (to: string, hash?: string) => () => {
    closeOverlay();
    // Already there: the router won't navigate to where you are, so scroll instead.
    if (location.pathname === to && (location.hash || undefined) === hash) {
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      if (hash) document.getElementById(hash)?.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
      return;
    }
    navigate({ to, hash });
  };
  const external = (href: string) => () => {
    closeOverlay();
    window.open(href, "_blank", "noopener,noreferrer");
  };

  const groups: { heading: string; items: Item[] }[] = [
    {
      heading: "Go to",
      items: [
        { id: "home", label: "Home", hint: "/", run: go("/") },
        { id: "work", label: "Selected work", hint: "/#work", run: go("/", "work") },
        {
          id: "turn",
          label: "Anatomy of a turn",
          hint: "/#turn",
          keywords: ["architecture", "agent loop"],
          run: go("/", "turn"),
        },
        {
          id: "thinking",
          label: "How I think",
          hint: "/thinking",
          keywords: ["thinking", "decisions", "principles"],
          run: go("/thinking"),
        },
        {
          id: "rules",
          label: "Rules I work by",
          hint: "/thinking#rules",
          keywords: ["thinking", "decisions"],
          run: go("/thinking", "rules"),
        },
        {
          id: "structure",
          label: "How I structure work",
          hint: "/thinking#structure",
          keywords: ["repo", "process", "habits"],
          run: go("/thinking", "structure"),
        },
        {
          id: "about",
          label: "About",
          hint: "/about",
          keywords: ["background", "bio"],
          run: go("/about"),
        },
        {
          id: "path",
          label: "The path so far",
          hint: "/about#path",
          keywords: ["experience", "career", "git log"],
          run: go("/about", "path"),
        },
        {
          id: "toolbox",
          label: "What I reach for",
          hint: "/about#toolbox",
          keywords: ["toolbox", "stack", "skills", "tools"],
          run: go("/about", "toolbox"),
        },
        { id: "notes", label: "Notes", hint: "/notes", run: go("/notes") },
        { id: "now", label: "Now", hint: "/now", run: go("/now") },
        { id: "uses", label: "Uses", hint: "/uses", run: go("/uses") },
        { id: "resume", label: "Résumé", hint: "/resume", keywords: ["cv", "pdf"], run: go("/resume") },
        {
          id: "colophon",
          label: "Colophon",
          hint: "/colophon",
          keywords: ["how this site was built", "credits"],
          run: go("/colophon"),
        },
        {
          id: "play",
          label: "Prompt golf (from the last version)",
          hint: "/play",
          keywords: ["game", "v2"],
          run: go("/play"),
        },
      ],
    },
    {
      heading: "Work",
      items: systems.map((s) => ({
        id: `sys-${s.slug}`,
        label: s.name,
        hint: s.year,
        keywords: s.stack,
        run: go(`/work/${s.slug}`),
      })),
    },
    {
      heading: "Notes",
      items: notes.map((n) => ({ id: `note-${n.slug}`, label: n.title, hint: n.date, run: go(`/notes/${n.slug}`) })),
    },
    {
      heading: "Do",
      items: [
        {
          id: "copy-email",
          label: copied ? "Copied, talk soon" : "Copy email address",
          hint: site.email,
          run: () => {
            navigator.clipboard?.writeText(site.email).then(
              () => setCopied(true),
              () => (window.location.href = `mailto:${site.email}`),
            );
          },
        },
        { id: "theme", label: "Lights on / off", hint: "theme", run: () => toggleTheme() },
        {
          id: "tldr",
          label: "Too lazy to scroll? Show the tl;dr",
          hint: keysOn ? "t" : undefined,
          run: () => openTldr(),
        },
        {
          id: "zzz",
          label: "Start the screensaver",
          hint: keysOn ? "z" : undefined,
          keywords: ["idle", "lazy"],
          run: () => startScreensaver(),
        },
        {
          id: "keys",
          label: keysOn ? "Turn off single-key shortcuts" : "Turn on single-key shortcuts",
          hint: "t · z",
          keywords: ["keyboard", "accessibility"],
          run: () => {
            setSingleKeys(!keysOn);
            setKeysOn(!keysOn);
          },
        },
        { id: "source", label: "View this site's source", hint: "github", run: external(site.repo) },
      ],
    },
    {
      heading: "Elsewhere",
      items: site.socials.map((s) => ({ id: `s-${s.label}`, label: s.label, hint: s.handle, run: external(s.href) })),
    },
  ];

  const row = (item: Item) => (
    <Command.Item
      key={item.id}
      value={`${item.label} ${item.hint ?? ""}`}
      keywords={item.keywords}
      onSelect={item.run}
      className="cmdk-item"
    >
      <span className="truncate">{item.label}</span>
      {item.hint && <span className="mono ml-auto shrink-0 pl-4 text-[11px] text-graphite">{item.hint}</span>}
    </Command.Item>
  );

  return (
    <Command.Dialog
      open
      onOpenChange={(o) => !o && closeOverlay()}
      label="Command menu"
      loop
      overlayClassName="cmdk-overlay"
      contentClassName="cmdk-content"
    >
      <div className="flex items-center gap-3 border-b border-rule px-4">
        <span aria-hidden className="mono text-kesari">
          ›
        </span>
        <Command.Input
          value={search}
          onValueChange={setSearch}
          placeholder="Where to? Type a page, a project, a note…"
          className="cmdk-input"
        />
        <kbd className="mono rounded border border-rule px-1.5 py-0.5 text-[10.5px] text-graphite">esc</kbd>
      </div>
      <Command.List className="cmdk-list" data-lenis-prevent>
        <Command.Empty className="mono px-4 py-6 text-[12.5px] text-graphite">
          Nothing by that name. Try “agent”, “notes” or “email”.
        </Command.Empty>
        {/* While searching, one flat list: cmdk 1.1 ranks items inside a group but never
            reorders the groups, so the best match could sit below a weak one. */}
        {search.trim()
          ? groups.flatMap((g) => g.items).map(row)
          : groups.map((g) =>
              g.items.length ? (
                <Command.Group key={g.heading} heading={g.heading}>
                  {g.items.map(row)}
                </Command.Group>
              ) : null,
            )}
      </Command.List>
      <div className="mono flex items-center justify-between border-t border-rule px-4 py-2 text-[10.5px] text-graphite">
        <span>↑↓ move · ↵ open</span>
        {keysOn && <span>t tl;dr · z sleep</span>}
      </div>
    </Command.Dialog>
  );
}
