// Contract tests for the content. A diagram that names a box that isn't drawn,
// or an edge with no line under it, renders as "nothing lit up" — silently.
// These make that loud.

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { parseAscii } from "@jrk/ascii";
import type { Diagram } from "./diagrams.ts";
import * as content from "./index.ts";

const isDiagram = (v: unknown): v is Diagram =>
  typeof v === "object" && v !== null && "src" in v && "steps" in v && Array.isArray((v as Diagram).steps);

function allDiagrams(): Diagram[] {
  const found = new Map<string, Diagram>();
  const visit = (v: unknown, depth = 0) => {
    if (depth > 4 || v === null || typeof v !== "object") return;
    if (isDiagram(v)) {
      found.set(v.id, v);
      return;
    }
    for (const child of Object.values(v as Record<string, unknown>)) visit(child, depth + 1);
  };
  visit(content);
  return [...found.values()];
}

test("there are diagrams to check", () => {
  assert.ok(allDiagrams().length > 0);
});

for (const d of allDiagrams()) {
  test(`diagram "${d.id}": every step names boxes that exist and edges that are drawn`, () => {
    const g = parseAscii(d.src, d.aliases);
    for (const [i, step] of d.steps.entries()) {
      for (const n of step.nodes) assert.ok(g.nodes.has(n), `step ${i + 1}: no box "${n}" (have: ${[...g.nodes.keys()].join(", ")})`);
      for (const [a, b] of step.edges) {
        assert.ok(g.nodes.has(a) && g.nodes.has(b), `step ${i + 1}: edge ${a} → ${b} names a missing box`);
        assert.ok(g.path(a, b).length > 0, `step ${i + 1}: no drawn line from ${a} to ${b}`);
      }
      for (const note of step.notes ?? []) {
        assert.ok(note.r >= 0 && note.r < g.height, `step ${i + 1}: note row ${note.r} is off the grid`);
        assert.ok(note.c >= 0 && note.c + [...note.text].length <= g.width + 12, `step ${i + 1}: note "${note.text}" runs off the grid`);
      }
    }
  });
}

test("system slugs are unique and every number says where it came from", () => {
  const slugs = new Set<string>();
  for (const s of content.systems) {
    assert.ok(!slugs.has(s.slug), `duplicate slug ${s.slug}`);
    slugs.add(s.slug);
    for (const m of s.metrics) assert.ok(m.source, `${s.slug}: metric "${m.label}" has no provenance`);
    if (s.private) assert.ok(!(s.links ?? []).some((l) => /github\.com\/netision/i.test(l.href)), `${s.slug}: private work links to source`);
  }
});

test("a figure that steps on its own has something to say at every step", () => {
  // The case-study figures and the hero's fig. 1 run through SteppedFigure, which prints each caption.
  const stepped = [...content.systems.flatMap((s) => (s.diagram ? [s.diagram] : [])), content.turnLoop];
  for (const d of stepped)
    for (const [i, step] of d.steps.entries()) assert.ok(step.caption.trim(), `step ${i + 1} of "${d.id}" has no caption`);
});

test("résumé dates are in the shape the JSON Resume export parses", () => {
  // generate.ts splits on " – " and reads "May 2025", "2022" or "present"; anything else is dropped silently.
  const when = /^(?:[A-Z][a-z]{2,} \d{4}|\d{4}) – (?:[A-Z][a-z]{2,} \d{4}|\d{4}|present)$/;
  for (const e of content.resume.experience) assert.match(e.when, when, `${e.org}: "${e.when}"`);
  for (const ed of content.resume.education) assert.match(ed.when, when, `${ed.school}: "${ed.when}"`);
});

test("no figure or replay claims there are no secrets", () => {
  // "Reads secrets only from the environment" is the claim the code supports; "no secrets" is not.
  const text = JSON.stringify(content);
  assert.ok(!/\b(no|zero) secrets\b/i.test(text), "a 'no secrets' claim crept back in");
});

test("note slugs are unique and dated", () => {
  const slugs = new Set<string>();
  for (const n of content.notes) {
    assert.ok(!slugs.has(n.slug), `duplicate note ${n.slug}`);
    slugs.add(n.slug);
    assert.match(n.date, /^\d{4}-\d{2}-\d{2}$/, `${n.slug}: date must be YYYY-MM-DD`);
  }
});

test("every replay span lights boxes and lines that exist in its diagram", () => {
  const replays = [
    { diagram: content.turnPipeline, scenarios: content.scenarios },
    ...content.systems.flatMap((s) => (s.replay ? [s.replay] : [])),
  ];
  assert.ok(replays.length >= 2);
  for (const { diagram, scenarios } of replays) {
    const g = parseAscii(diagram.src, diagram.aliases);
    for (const sc of scenarios) {
      let last = -1;
      for (const s of sc.spans) {
        for (const n of s.nodes) assert.ok(g.nodes.has(n), `${diagram.id}/${sc.id}/${s.name}: no box "${n}"`);
        for (const [a, b] of s.edges) assert.ok(g.path(a, b).length > 0, `${diagram.id}/${sc.id}/${s.name}: no line ${a} → ${b}`);
        assert.ok(s.at >= last || s.tone === "stop", `${diagram.id}/${sc.id}/${s.name}: spans must start in order`);
        last = s.at;
      }
    }
  }
});

test("rules are unique and point at systems that exist", () => {
  const ids = new Set<string>();
  const slugs = new Set(content.systems.map((s) => s.slug));
  for (const r of content.rules) {
    assert.ok(!ids.has(r.id), `duplicate rule ${r.id}`);
    ids.add(r.id);
    if (r.from) assert.ok(slugs.has(r.from), `rule ${r.id} points at missing system ${r.from}`);
  }
});

test("the CSP in vercel.json allows the inline theme script, byte for byte", () => {
  // Edit that script and its hash must change too, or the theme flashes on load in production.
  const html = readFileSync(new URL("../../../apps/web/index.html", import.meta.url), "utf8");
  const vercel = readFileSync(new URL("../../../vercel.json", import.meta.url), "utf8");
  const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.equal(inline.length, 1, "expected exactly one plain inline script");
  const hash = `sha256-${createHash("sha256").update(inline[0]).digest("base64")}`;
  assert.ok(vercel.includes(`'${hash}'`), `vercel.json's CSP is missing '${hash}'`);
});
