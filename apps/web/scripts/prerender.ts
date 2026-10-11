// Writes every page as finished HTML after `vite build`: the page's own <head> (title,
// description, canonical, link previews, structured data) and its rendered markup, so
// search engines, link previews and AI crawlers read the page without running JavaScript.
// In the browser the live app replaces it (see main.tsx). Unknown paths get 404.html,
// which Vercel serves with a real 404 status.
//
// It checks what it writes, and fails the build on a page without one title, one h1,
// a description of a sensible length or the canonical it should have.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { site } from "@jrk/content";
import { pages } from "./routes.ts";

const at = (p: string) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const { render } = (await import(pathToFileURL(at("dist-ssr/entry-server.js")).href)) as {
  render: (url: string) => Promise<{ html: string }>;
};

const shell = readFileSync(at("dist/index.html"), "utf8");
const SLOT = '<div id="root"><!--app--></div>';
if (!shell.includes(SLOT)) throw new Error("dist/index.html has no <!--app--> slot to fill");

// React hoists a page's <title>, <meta> and <link> to the front of its output.
const HEAD = /^(?:<title>[\s\S]*?<\/title>|<meta [^>]*\/>|<link [^>]*\/>)*/;

const problems: string[] = [];
const count = (s: string, re: RegExp) => s.match(re)?.length ?? 0;

async function page(path: string, file: string, missing = false) {
  const out = await render(path);
  const head = out.html.match(HEAD)?.[0] ?? "";
  const body = out.html.slice(head.length);
  // Marked so the live app can take them down before it puts up its own.
  const tags = head.replace(/<(title|meta|link)\b/g, "<$1 data-prerendered");
  const html = shell
    .replace("</head>", `    ${tags}\n  </head>`)
    .replace(SLOT, () => `<div id="root" data-prerendered>${body}</div>`);

  const say = (msg: string) => problems.push(`${path}: ${msg}`);
  const description = head.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
  if (count(head, /<title>/g) !== 1) say("needs exactly one <title>");
  if (description.length < 50 || description.length > 170) say(`description is ${description.length} chars`);
  if (count(body, /<h1[\s>]/g) !== 1) say(`has ${count(body, /<h1[\s>]/g)} <h1>`);
  // Only the 404 page is noindex; any other page that says so has rendered the 404.
  if (head.includes('name="robots" content="noindex"') !== missing)
    say(missing ? "isn't the 404 page" : "rendered the 404 page");
  if (!missing) {
    const canonical = head.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
    const expected = path === "/" ? `${site.url}/` : `${site.url}${path}`;
    if (canonical !== expected) say(`canonical is ${canonical}, expected ${expected}`);
  }
  for (const [, json] of body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch {
      say("has JSON-LD that doesn't parse");
    }
  }

  const dest = at(`dist/${file}`);
  mkdirSync(dirname(dest), { recursive: true });
  writeFileSync(dest, html, "utf8");
}

for (const p of pages) await page(p.path, p.path === "/" ? "index.html" : `${p.path.slice(1)}.html`);
await page("/404", "404.html", true);
rmSync(at("dist-ssr"), { recursive: true, force: true });

if (problems.length) {
  console.error(`prerender: ${problems.length} problem(s)\n  ${problems.join("\n  ")}`);
  process.exit(1);
}
console.log(`prerender: ${pages.length} pages and 404.html`);
