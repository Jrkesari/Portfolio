// Turns @jrk/content into the plain-text, JSON and XML views of this site:
//   public/llms.txt     — for language models and people who like text
//   public/resume.json  — JSON Resume (jsonresume.org), the same facts as /resume
//   public/resume.md    — the same again, as Markdown, for agents and copy-paste
//   public/sitemap.xml  — every page, from the same list the build prerenders
//   public/feed.xml     — the notes, as RSS
// Pure: the same content always writes the same files, so turbo can cache it.
// Runs before `dev` and `build` (see turbo.json). All of them are gitignored.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { hero, notes, resume, rules, site, systems } from "@jrk/content";
import { pages } from "./routes.ts";

const out = (name: string) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
const plain = (s: string) => s.replace(/\*\*|==|`|\*/g, "").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

const llms = [
  `# ${site.name}`,
  "",
  `> ${plain(hero.lede)}`,
  "",
  plain(hero.sub),
  "",
  `- Email: ${site.email}`,
  ...site.socials.map((s) => `- ${s.label}: ${s.href}`),
  `- Site: ${site.url}`,
  `- Résumé: ${site.url}/resume (also /resume.md, /resume.json, /resume.pdf)`,
  "",
  "## Selected work",
  "",
  ...systems.map((s) => `- [${s.name}](${site.url}/work/${s.slug}): ${plain(s.oneLiner)} (${s.where}; ${s.role})`),
  "",
  "## Rules I work by",
  "",
  ...rules.map((r) => `- ${r.rule} ${plain(r.practice)}`),
  "",
  "## Notes",
  "",
  ...notes.map((n) => `- [${n.title}](${site.url}/notes/${n.slug}) (${n.date}): ${plain(n.summary)}`),
  "",
].join("\n");

writeFileSync(out("llms.txt"), llms, "utf8");
console.log(`llms.txt: ${llms.length} chars, ${systems.length} systems, ${notes.length} notes`);

// JSON Resume (https://jsonresume.org/schema) — the same facts as /resume.
// Its dates are ISO 8601: "May 2025" → "2025-05", "2022" → "2022", "present" → none.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const iso = (s: string | undefined) => {
  const t = s?.trim() ?? "";
  const m = /^([A-Z][a-z]{2})[a-z]* (\d{4})$/.exec(t);
  if (m && MONTHS.includes(m[1])) return `${m[2]}-${String(MONTHS.indexOf(m[1]) + 1).padStart(2, "0")}`;
  return /^\d{4}$/.test(t) ? t : undefined;
};
const span = (when: string) => {
  const [from, to] = when.split(" – ");
  return { startDate: iso(from), endDate: iso(to) };
};

const json = {
  $schema: "https://raw.githubusercontent.com/jsonresume/resume-schema/v1.0.0/schema.json",
  basics: {
    name: site.name,
    label: resume.title,
    email: site.email,
    url: site.url,
    summary: resume.summary,
    location: { city: site.city, countryCode: "IN" },
    profiles: site.socials.map((s) => ({ network: s.label, username: s.handle.replace(/^@|^in\//, ""), url: s.href })),
  },
  work: resume.experience.map((e) => ({
    name: e.org,
    position: e.role,
    location: e.where,
    ...span(e.when),
    highlights: e.groups.flatMap((g) => g.bullets),
  })),
  education: resume.education.map((ed) => ({
    institution: ed.school,
    studyType: ed.degree,
    score: ed.grade,
    ...span(ed.when),
  })),
  certificates: resume.certifications.map((c) => ({ name: c })),
  skills: resume.skills.map((s) => ({ name: s.label, keywords: s.value.split(/,\s*/) })),
  projects: resume.projects.map((p) => ({ name: p.name, description: p.detail, keywords: p.stack.split(/,\s*/) })),
};
writeFileSync(out("resume.json"), JSON.stringify(json, null, 2), "utf8");
console.log("resume.json written");

// The résumé as Markdown — what an agent (or a recruiter's paste box) wants.
const md = [
  `# ${site.name}`,
  "",
  resume.title,
  "",
  `${site.email} · ${site.socials.map((s) => s.href).join(" · ")} · ${site.url}`,
  "",
  "## Profile",
  "",
  resume.summary,
  "",
  "## Skills",
  "",
  ...resume.skills.map((s) => `- **${s.label}:** ${s.value}`),
  "",
  "## Experience",
  ...resume.experience.flatMap((e) => [
    "",
    `### ${e.org} · ${e.role}`,
    "",
    `${e.when} · ${e.where}`,
    ...e.groups.flatMap((g) => ["", ...(g.heading ? [`**${g.heading}**`, ""] : []), ...g.bullets.map((b) => `- ${b}`)]),
  ]),
  "",
  "## Projects",
  "",
  ...resume.projects.map((p) => `- **${p.name}.** ${p.detail} (${p.stack})`),
  "",
  "## Education",
  "",
  ...resume.education.map((ed) => `- ${ed.school} · ${ed.degree}, ${ed.grade} (${ed.when})`),
  "",
  "## Certifications",
  "",
  ...resume.certifications.map((c) => `- ${c}`),
  "",
].join("\n");
writeFileSync(out("resume.md"), md, "utf8");
console.log("resume.md written");

// The sitemap, from the same list the build prerenders.
const sitemap = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...pages.map(
    (p) =>
      `  <url><loc>${site.url}${p.path === "/" ? "/" : p.path}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}</url>`,
  ),
  `</urlset>`,
  "",
].join("\n");
writeFileSync(out("sitemap.xml"), sitemap, "utf8");
console.log(`sitemap.xml: ${pages.length} pages`);

// The notes as RSS 2.0, for feed readers and anyone who'd rather not check back.
const xml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const rfc822 = (d: string) => new Date(`${d}T00:00:00+05:30`).toUTCString();
const latest = [...notes].sort((a, b) => b.date.localeCompare(a.date));
const feed = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">`,
  "  <channel>",
  `    <title>Notes · ${xml(site.name)}</title>`,
  `    <link>${site.url}/notes</link>`,
  `    <description>Field notes on building agents: cost, safety, retrieval and the decisions behind them.</description>`,
  "    <language>en</language>",
  `    <atom:link href="${site.url}/feed.xml" rel="self" type="application/rss+xml" />`,
  ...(latest[0] ? [`    <lastBuildDate>${rfc822(latest[0].date)}</lastBuildDate>`] : []),
  ...latest.map((n) =>
    [
      "    <item>",
      `      <title>${xml(n.title)}</title>`,
      `      <link>${site.url}/notes/${n.slug}</link>`,
      `      <guid isPermaLink="true">${site.url}/notes/${n.slug}</guid>`,
      `      <pubDate>${rfc822(n.date)}</pubDate>`,
      `      <description>${xml(plain(n.summary))}</description>`,
      ...n.tags.map((t) => `      <category>${xml(t)}</category>`),
      "    </item>",
    ].join("\n"),
  ),
  "  </channel>",
  "</rss>",
  "",
].join("\n");
writeFileSync(out("feed.xml"), feed, "utf8");
console.log(`feed.xml: ${notes.length} notes`);
