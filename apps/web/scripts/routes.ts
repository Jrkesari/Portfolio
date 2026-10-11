// Every page the site has, in one list: the sitemap is written from it and the build
// prerenders each one, so a page can't be in one and missing from the other.
import { notes, now, systems } from "@jrk/content";

export type Page = { path: string; lastmod?: string };

// lastmod only where the content carries a real date; a guessed one teaches crawlers to ignore it.
export const pages: Page[] = [
  { path: "/" },
  ...systems.map((s) => ({ path: `/work/${s.slug}` })),
  { path: "/thinking" },
  { path: "/about" },
  {
    path: "/notes",
    lastmod: notes
      .map((n) => n.date)
      .sort()
      .at(-1),
  },
  ...notes.map((n) => ({ path: `/notes/${n.slug}`, lastmod: n.date })),
  { path: "/now", lastmod: now.updated },
  { path: "/uses" },
  { path: "/resume" },
  { path: "/colophon" },
  { path: "/play" },
];
