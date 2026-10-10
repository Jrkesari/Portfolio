import assert from "node:assert/strict";
import { test } from "node:test";
import { parseAscii, toRows } from "./index.ts";

const loop = String.raw`
┌──────────┐   ┌────────────┐   ┌────────┐
│ question │──▶│ agent loop │──▶│ answer │
└──────────┘   └──┬──────┬──┘   └────────┘
                  │      ▲
           tools  ▼      │  results
               ┌─────────┴──┐    ┌────────┐
               │ MCP server │┄┄┄▶│ ledger │
               └────────────┘    └────────┘`;

test("rows are trimmed of blank edges and padded to one width", () => {
  const rows = toRows("\n  a\nbcd\n\n");
  assert.deepEqual(rows, ["  a", "bcd"]);
});

test("boxes are found and named by their label", () => {
  const g = parseAscii(loop);
  assert.deepEqual([...g.nodes.keys()], ["question", "agent-loop", "answer", "mcp-server", "ledger"]);
  const loopBox = g.nodes.get("agent-loop")!;
  assert.equal(g.nodeAt(1, 20)?.id, "agent-loop");
  assert.equal(g.nodeAt(4, 20), undefined);
  assert.deepEqual([loopBox.r, loopBox.c, loopBox.r2, loopBox.c2], [0, 15, 2, 28]);
});

test("a path runs between two boxes along the line that joins them", () => {
  const g = parseAscii(loop);
  const p = g.path("question", "agent-loop");
  assert.equal(p.length, 3);
  assert.deepEqual(p.at(-1), { r: 1, c: 14 });
});

test("arrowheads are one-way, so parallel lines stay distinct", () => {
  const g = parseAscii(loop);
  const down = g.path("agent-loop", "mcp-server");
  const up = g.path("mcp-server", "agent-loop");
  assert.ok(down.length > 0 && up.length > 0);
  // "tools" goes down the left line, "results" comes back up the right one.
  assert.ok(down.every((c) => c.c === 18));
  assert.ok(up.every((c) => c.c === 25));
});

test("a line drawn against an arrow is not a path", () => {
  const g = parseAscii(loop);
  assert.deepEqual(g.path("answer", "agent-loop"), []);
  assert.deepEqual(g.path("ledger", "mcp-server"), []);
});

test("dashed lines count as lines", () => {
  const g = parseAscii(loop);
  assert.equal(g.path("mcp-server", "ledger").length, 4);
});

test("aliases rename a box without touching the drawing", () => {
  const g = parseAscii(loop, { "MCP server": "tools" });
  assert.ok(g.nodes.has("tools"));
  assert.ok(g.path("agent-loop", "tools").length > 0);
});

test("a box can loop back into itself", () => {
  const selfLoop = String.raw`
┌──────┐
│ loop │──┐
└──────┘  │
   ▲      │
   └──────┘`;
  const g = parseAscii(selfLoop);
  const p = g.path("loop", "loop");
  assert.ok(p.length >= 8, `expected a long way round, got ${p.length}`);
});

test("┼ is a junction where lines merge; ╫ is a crossing that goes straight", () => {
  const merge = String.raw`
┌───┐
│ a │──┐
└───┘  │
┌───┐  │   ┌─────┐
│ b │──┼──▶│ hub │
└───┘  │   └─────┘
┌───┐  │
│ c │──┘
└───┘`;
  const g = parseAscii(merge);
  for (const n of ["a", "b", "c"]) assert.ok(g.path(n, "hub").length > 0, `${n} reaches hub`);
  const crossing = merge.replace("┼", "╫");
  const g2 = parseAscii(crossing);
  assert.ok(g2.path("b", "hub").length > 0, "b goes straight across");
  assert.deepEqual(g2.path("a", "hub"), [], "a cannot turn at a crossing");
});
