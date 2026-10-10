import type { Diagram } from "./diagrams.ts";
import type { Scenario } from "./replay.ts";

// "Where does an upload go?" — the document router in the shared library,
// replayed for five kinds of file. Thresholds and behaviours are the real ones;
// timings are illustrative.

export const routerFigure: Diagram = {
  id: "doc-router",
  label:
    "Diagram of the document router: an upload is checked against accepted types or refused; spreadsheets go to table detection and DuckDB; files with almost no text go to vision transcription; everything else goes to the text reader; text and vision output become chunks.",
  src: String.raw`
┌──────────┐
│  upload  │
└────┬─────┘
     ▼
┌──────────┐       ┌─────────┐
│ accepted │┄┄┄┄┄┄▶│ refused │
└────┬─────┘       └─────────┘
     ▼
┌──────────┐       ┌─────────┐       ┌────────┐
│ tabular  │──────▶│ tables  │──────▶│ DuckDB │
└────┬─────┘       └─────────┘       └────────┘
     ▼
┌──────────┐       ┌─────────┐
│ density  │──────▶│ vision  │
└────┬─────┘       └────┬────┘
     ▼                  │
┌──────────┐            │
│   text   │            │
└────┬─────┘            │
     ▼                  ▼
┌─────────────────────────────┐
│           chunks            │
└─────────────────────────────┘`,
  steps: [{ caption: "", nodes: ["upload"], edges: [["upload", "accepted"]] }],
};

export const routerScenarios: Scenario[] = [
  {
    id: "deck",
    chip: "a designed deck",
    ask: "Upload: a pitch deck, all pictures and almost no text.",
    attachment: "board-review.pptx",
    moral: "Decided by what's in the file, not what it's called. And the expensive read happens once, at upload, never per question.",
    spans: [
      { name: "accepted", detail: ".pptx · under 20 MB", at: 0, ms: 2, nodes: ["upload", "accepted"], edges: [["upload", "accepted"]], why: "Checked against what the product accepts: by extension, because browsers report a .csv as an Excel file on Windows and send nothing at all for .parquet." },
      { name: "tabular", detail: "no", at: 2, ms: 1, nodes: ["tabular"], edges: [["accepted", "tabular"]], why: "Not a spreadsheet, so on to the next question." },
      { name: "density", detail: "52 chars, whole deck", at: 3, ms: 40, nodes: ["density"], edges: [["tabular", "density"]], tone: "warn", why: "Under 150 characters a page, the content is pixels. Two real decks had 52 and 168 characters of text in total. A text reader would have indexed nothing and called it done." },
      { name: "vision", detail: "6 pages in flight", at: 43, ms: 800, nodes: ["vision"], edges: [["density", "vision"]], why: "The largest picture on each slide is lifted straight out of the file. No re-render. Pages go six at a time instead of one after another." },
      { name: "chunks", detail: "markdown · 1200/200", at: 843, ms: 60, nodes: ["chunks"], edges: [["vision", "chunks"]], why: "Transcribed pages are ordinary Markdown now, so retrieval costs what it always did. Newlines are kept. A flattened table is one no renderer will draw." },
    ],
  },
  {
    id: "pdf",
    chip: "a text PDF",
    ask: "Upload: a 30-page report, mostly prose.",
    attachment: "annual-report.pdf",
    moral: "The cheap path stays cheap. Only files that need eyes get them.",
    spans: [
      { name: "accepted", detail: ".pdf", at: 0, ms: 2, nodes: ["upload", "accepted"], edges: [["upload", "accepted"]], why: "Same gate for every file." },
      { name: "tabular", detail: "no", at: 2, ms: 1, nodes: ["tabular"], edges: [["accepted", "tabular"]], why: "A PDF can hold tables, but it isn't a sheet of them." },
      { name: "density", detail: "plenty of text", at: 3, ms: 30, nodes: ["density"], edges: [["tabular", "density"]], why: "Well above the line, so no vision call and no vision bill." },
      { name: "text", detail: "page by page", at: 33, ms: 260, nodes: ["text"], edges: [["density", "text"]], why: "Read page by page. If a whole file yields under 600 characters, OCR runs in 20-page slabs instead. And a half-finished OCR result is thrown away rather than indexed." },
      { name: "chunks", detail: "1200/200", at: 293, ms: 50, nodes: ["chunks"], edges: [["text", "chunks"]], why: "Chunked with overlap and embedded into this conversation's scope only." },
    ],
  },
  {
    id: "sheet",
    chip: "a spreadsheet",
    ask: "Upload: a media plan, one sheet, three tables side by side.",
    attachment: "q3-plan.xlsx",
    moral: "Spreadsheets are queried, not retrieved. Only a short card per table is embedded.",
    spans: [
      { name: "accepted", detail: ".xlsx", at: 0, ms: 2, nodes: ["upload", "accepted"], edges: [["upload", "accepted"]], why: "Accepted. And the gate asks the reader registry whether anything can read it, after a real bug where a working reader sat behind a gate that refused its type." },
      { name: "tabular", detail: "yes", at: 2, ms: 1, nodes: ["tabular"], edges: [["accepted", "tabular"]], why: "Sheets take a different road from here." },
      { name: "tables", detail: "3 found", at: 3, ms: 180, nodes: ["tables"], edges: [["tabular", "tables"]], why: "Split on blank rows and spacer columns; banner rows become titles; two-level headers are folded into names; total rows flagged by their label and by arithmetic." },
      { name: "DuckDB", detail: "locked down, scoped", at: 183, ms: 90, nodes: ["duckdb"], edges: [["tables", "duckdb"]], why: "Stored for SQL in a connection that can't touch the filesystem, scoped to this conversation. The model starts from a short schema card and asks for rows with a query." },
    ],
  },
  {
    id: "capture",
    chip: "a tall screenshot",
    ask: "Upload: a full-page scroll capture, 1689 × 10000 px.",
    attachment: "dashboard.png",
    moral: "When a model can't read something, it shouldn't be put in a position where inventing it is easier.",
    spans: [
      { name: "accepted", detail: ".png", at: 0, ms: 2, nodes: ["upload", "accepted"], edges: [["upload", "accepted"]], why: "Images are accepted like any document." },
      { name: "tabular", detail: "no", at: 2, ms: 1, nodes: ["tabular"], edges: [["accepted", "tabular"]], why: "On to density." },
      { name: "density", detail: "an image is pixels", at: 3, ms: 5, nodes: ["density"], edges: [["tabular", "density"]], why: "An image is the one-page case of a visual document." },
      { name: "vision", detail: "cut into strips", at: 8, ms: 1400, nodes: ["vision"], edges: [["density", "vision"]], tone: "warn", why: "Shrunk to fit, this capture was 270 px wide. And the model confidently invented a report, which then got indexed. Now anything taller than 2.5:1 is cut into overlapping strips, and the prompt allows `[illegible]`." },
      { name: "chunks", detail: "markdown", at: 1408, ms: 50, nodes: ["chunks"], edges: [["vision", "chunks"]], why: "Only what was actually read goes in." },
    ],
  },
  {
    id: "exe",
    chip: "something odd",
    ask: "Upload: an installer.",
    attachment: "setup.exe",
    moral: "Refuse at the door, with a reason a person can act on.",
    spans: [
      { name: "accepted", detail: "no", at: 0, ms: 2, nodes: ["accepted", "refused"], edges: [["upload", "accepted"], ["accepted", "refused"]], tone: "stop", why: "Ten extensions and 20 MB are accepted, mirrored from the frontend's own list. Anything else is refused with a reason, never silently indexed as an empty document." },
    ],
  },
];
