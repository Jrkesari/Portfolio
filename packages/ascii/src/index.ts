// A tiny engine for box-drawing diagrams — the same kind I draw in READMEs.
//
// A diagram is plain text. We find the boxes (┌─┐ / ╭─╮ / ╔═╗), name them by
// their label, and trace the lines between them so the renderer can light a
// path up and send a packet along it. Arrowheads are one-way: a path may only
// cross ▶ moving right, ▼ moving down, and so on — which is how two parallel
// lines ("tools ▼" and "results ▲") between the same boxes stay distinct.

export type Cell = { r: number; c: number };

export interface AsciiNode {
  id: string;
  label: string;
  r: number;
  c: number;
  r2: number;
  c2: number;
}

export interface AsciiGraph {
  rows: string[];
  width: number;
  height: number;
  nodes: Map<string, AsciiNode>;
  /** Lookup: which node (if any) covers a cell. */
  nodeAt: (r: number, c: number) => AsciiNode | undefined;
  /** Shortest line path from one box to another (cells strictly between them). */
  path: (from: string, to: string) => Cell[];
}

// Directions: 0 up, 1 right, 2 down, 3 left. Openings are a 4-bit mask.
const DR = [-1, 0, 1, 0];
const DC = [0, 1, 0, -1];
const U = 1,
  R = 2,
  D = 4,
  L = 8;
const BIT = [U, R, D, L];

const OPEN: Record<string, number> = {
  "─": R | L,
  "━": R | L,
  "═": R | L,
  "┄": R | L,
  "┈": R | L,
  "╌": R | L,
  "│": U | D,
  "┃": U | D,
  "║": U | D,
  "┆": U | D,
  "┊": U | D,
  "╎": U | D,
  "┌": R | D,
  "╭": R | D,
  "╔": R | D,
  "┐": L | D,
  "╮": L | D,
  "╗": L | D,
  "└": U | R,
  "╰": U | R,
  "╚": U | R,
  "┘": U | L,
  "╯": U | L,
  "╝": U | L,
  "├": U | D | R,
  "┤": U | D | L,
  "┬": L | R | D,
  "┴": L | R | U,
  "┼": U | R | D | L,
  "╫": U | R | D | L,
  "╞": U | D | R,
  "╡": U | D | L,
  "╤": L | R | D,
  "╧": L | R | U,
  "╪": U | R | D | L,
  "▶": R | L,
  "►": R | L,
  "◀": R | L,
  "◄": R | L,
  "▲": U | D,
  "▼": U | D,
};

// Arrowheads may only be crossed in their own direction.
const ONE_WAY: Record<string, number> = { "▶": 1, "►": 1, "◀": 3, "◄": 3, "▲": 0, "▼": 2 };

const TOP_LEFT = new Set(["┌", "╭", "╔"]);
const TOP_RIGHT = new Set(["┐", "╮", "╗"]);
const BOTTOM_LEFT = new Set(["└", "╰", "╚"]);
const BOTTOM_RIGHT = new Set(["┘", "╯", "╝"]);
const H_BORDER = new Set(["─", "═", "┬", "┴", "┼", "╤", "╧", "╪", "━", "┄", "╌"]);
const V_BORDER = new Set(["│", "║", "├", "┤", "┼", "╞", "╡", "╪", "┃", "┆", "╎"]);

export function slug(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Normalise a template literal: drop the first/last blank line, pad rows. */
export function toRows(src: string): string[] {
  const lines = src.replace(/\t/g, "    ").split("\n");
  while (lines.length && lines[0].trim() === "") lines.shift();
  while (lines.length && lines[lines.length - 1].trim() === "") lines.pop();
  const width = Math.max(0, ...lines.map((l) => [...l].length));
  return lines.map((l) => {
    const chars = [...l];
    return chars.join("") + " ".repeat(width - chars.length);
  });
}

export function parseAscii(src: string, aliases: Record<string, string> = {}): AsciiGraph {
  const rows = toRows(src);
  const grid = rows.map((r) => [...r]);
  const height = grid.length;
  const width = height ? grid[0].length : 0;
  const at = (r: number, c: number) => (r >= 0 && r < height && c >= 0 && c < width ? grid[r][c] : " ");

  // ---- boxes --------------------------------------------------------------
  const nodes = new Map<string, AsciiNode>();
  const cover: (AsciiNode | undefined)[][] = grid.map((row) => row.map(() => undefined));

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (!TOP_LEFT.has(at(r, c))) continue;
      let c2 = c + 1;
      while (c2 < width && H_BORDER.has(at(r, c2))) c2++;
      if (!TOP_RIGHT.has(at(r, c2)) || c2 - c < 2) continue;
      let r2 = r + 1;
      while (r2 < height && V_BORDER.has(at(r2, c))) r2++;
      if (!BOTTOM_LEFT.has(at(r2, c)) || !BOTTOM_RIGHT.has(at(r2, c2)) || r2 - r < 2) continue;
      // sanity: right border is vertical all the way down
      let ok = true;
      for (let k = r + 1; k < r2; k++) if (!V_BORDER.has(at(k, c2))) ok = false;
      if (!ok) continue;

      const label = grid
        .slice(r + 1, r2)
        .map((row) =>
          row
            .slice(c + 1, c2)
            .join("")
            .trim(),
        )
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ");
      let id = aliases[label] ?? slug(label || `box-${r}-${c}`);
      if (nodes.has(id)) {
        let n = 2;
        while (nodes.has(`${id}-${n}`)) n++;
        id = `${id}-${n}`;
      }
      const node: AsciiNode = { id, label, r, c, r2, c2 };
      nodes.set(id, node);
      for (let rr = r; rr <= r2; rr++) for (let cc = c; cc <= c2; cc++) cover[rr][cc] = node;
    }
  }

  const nodeAt = (r: number, c: number) => (r >= 0 && r < height && c >= 0 && c < width ? cover[r][c] : undefined);

  // ---- paths --------------------------------------------------------------
  const cache = new Map<string, Cell[]>();

  function path(from: string, to: string): Cell[] {
    const key = `${from}>${to}`;
    const hit = cache.get(key);
    if (hit) return hit;
    const A = nodes.get(from);
    const B = nodes.get(to);
    if (!A || !B) return [];

    // States are (r, c, dirOfTravel). Seed from every line cell that touches
    // A's border from the outside and opens back towards A.
    type S = { r: number; c: number; d: number; prev: number };
    const states: S[] = [];
    const seen = new Set<string>();
    const queue: number[] = [];

    const canEnter = (r: number, c: number, d: number) => {
      const ch = at(r, c);
      const open = OPEN[ch];
      if (!open) return false;
      if (!(open & BIT[(d + 2) % 4])) return false; // must open back the way we came
      const ow = ONE_WAY[ch];
      if (ow !== undefined && ow !== d) return false;
      if (cover[r][c]) return false; // never run through a box
      return true;
    };

    const push = (r: number, c: number, d: number, prev: number) => {
      const k = `${r},${c},${d}`;
      if (seen.has(k)) return;
      seen.add(k);
      states.push({ r, c, d, prev });
      queue.push(states.length - 1);
    };

    for (let r = A.r; r <= A.r2; r++) {
      for (let c = A.c; c <= A.c2; c++) {
        const onBorder = r === A.r || r === A.r2 || c === A.c || c === A.c2;
        if (!onBorder) continue;
        for (let d = 0; d < 4; d++) {
          const nr = r + DR[d];
          const nc = c + DC[d];
          if (nodeAt(nr, nc) === A) continue;
          if (canEnter(nr, nc, d)) push(nr, nc, d, -1);
        }
      }
    }

    let goal = -1;
    for (let qi = 0; qi < queue.length && goal < 0; qi++) {
      const idx = queue[qi];
      const s = states[idx];
      const ch = at(s.r, s.c);
      const open = OPEN[ch] ?? 0;
      const ow = ONE_WAY[ch];
      for (let d = 0; d < 4; d++) {
        if (!(open & BIT[d])) continue;
        if (d === (s.d + 2) % 4) continue; // no U-turns
        if (ch === "╪" || ch === "╫") {
          if (d !== s.d) continue; // a drawn crossing goes straight through
        }
        if (ow !== undefined && d !== ow) continue;
        const nr = s.r + DR[d];
        const nc = s.c + DC[d];
        const hitNode = nodeAt(nr, nc);
        if (hitNode === B) {
          // self-loops must actually leave first
          if (from === to) {
            let len = 0;
            for (let p = idx; p >= 0; p = states[p].prev) len++;
            if (len < 3) continue;
          }
          goal = idx;
          break;
        }
        if (canEnter(nr, nc, d)) push(nr, nc, d, idx);
      }
    }

    const out: Cell[] = [];
    for (let p = goal; p >= 0; p = states[p].prev) out.push({ r: states[p].r, c: states[p].c });
    out.reverse();
    cache.set(key, out);
    // An empty path renders as "nothing lit up" — the content tests in
    // @jrk/content assert every edge a diagram names actually exists.
    return out;
  }

  return { rows, width, height, nodes, nodeAt, path };
}

/**
 * A figure's words without its drawing: box and line characters dropped, arrows
 * read as "→", one row per clause. For text-heavy figures, this is a better
 * accessible name than a caption that's already printed underneath.
 */
export function plainText(src: string): string {
  return toRows(src)
    .map((row) =>
      row
        .replace(/[─━┄═]*[▶►]/g, " → ")
        .replace(/[◀◄][─━┄═]*/g, " ← ")
        .replace(/[┌┐└┘├┤┬┴┼│─━┄┆╭╮╰╯╔╗╚╝║═╪╫▲▼]/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter((row) => row && row !== "→" && row !== "←")
    .join("; ");
}
