// Turns @jrk/content into the plain-text, JSON and XML views of this site:
//   public/llms.txt     — for language models and people who like text
//   public/resume.json  — JSON Resume (jsonresume.org), the same facts as /resume
//   public/resume.md    — the same again, as Markdown, for agents and copy-paste
//   public/sitemap.xml  — every route, from the same slugs the router uses
// Pure: the same content always writes the same files, so turbo can cache it.
// Runs before `dev` and `build` (see turbo.json). All three are gitignored.
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { hero, notes, resume, rules, site, systems } from "@jrk/content";

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

// The sitemap, from the same slugs the router uses — so a renamed page can't linger.
const routes = [
  "/",
  ...systems.map((s) => `/work/${s.slug}`),
  "/thinking",
  "/about",
  "/notes",
  ...notes.map((n) => `/notes/${n.slug}`),
  "/now",
  "/uses",
  "/resume",
  "/colophon",
];
const sitemap = [
  `<?xml version="1.0" encoding="UTF-8"?>`,
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
  ...routes.map((r) => `  <url><loc>${site.url}${r}</loc></url>`),
  `</urlset>`,
  "",
].join("\n");
writeFileSync(out("sitemap.xml"), sitemap, "utf8");
console.log(`sitemap.xml: ${routes.length} routes`);
