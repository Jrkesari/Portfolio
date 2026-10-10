import type { Diagram, Edge } from "./diagrams.ts";

// "Anatomy of a turn" — scripted replays of what the query backend does with a
// question. The shape of every trace is real; the timings are illustrative and
// labelled as such on the page.

export const turnPipeline: Diagram = {
  id: "turn-pipeline",
  label:
    "Diagram of one turn: a question passes guards (or is refused), resolves history, retrieves vectors, then an agent loop calls MCP tools that are metered into a ledger, may park an approval card, and finally persists the answer.",
  src: String.raw`
┌──────────┐
│ question │
└────┬─────┘
     ▼
┌──────────┐         ┌─────────┐
│  guards  │┄┄┄┄┄┄┄┄▶│ refused │
└────┬─────┘         └─────────┘
     ▼
┌──────────┐         ┌─────────┐
│ resolve  │◀────────│ history │
└────┬─────┘         └─────────┘
     ▼
┌──────────┐         ┌─────────┐
│ retrieve │◀────────│ vectors │
└────┬─────┘         └─────────┘
     ▼
┌────────────┐       ┌───────────┐
│ agent loop │──────▶│ MCP tools │
│            │◀──────│           │
└──┬──────┬──┘       └─────┬─────┘
   │      │                ┊
   │      ▼                ▼
   │  ┌────────┐      ┌─────────┐
   │  │  card  │      │ ledger  │
   │  └────────┘      └─────────┘
   ▼
┌──────────┐
│ persist  │
└──────────┘`,
  // Captions show where this figure steps on its own (the query-backend case study);
  // the replays narrate the same parts span by span.
  steps: [
    { caption: "A question arrives with its model and its agent. Anything that can be refused is refused now, before the 202. A bad request fails as one, not as a broken answer later.", nodes: ["question", "guards"], edges: [["question", "guards"]] },
    { caption: "Unknown model, unknown agent, empty prompt: refused synchronously, before anything is promised.", nodes: ["guards", "refused"], edges: [["guards", "refused"]] },
    { caption: "History and tagged files first: which conversation this is, and which documents the question is about.", nodes: ["resolve"], edges: [["guards", "resolve"], ["history", "resolve"]] },
    { caption: "One embedding, the top 12 chunks from this conversation's scope, not the whole workspace.", nodes: ["retrieve"], edges: [["resolve", "retrieve"], ["vectors", "retrieve"]] },
    {
      caption: "At most four rounds. Tool calls in a round run together, every result is cut to 8,000 characters, and every call lands in the ledger.",
      nodes: ["agent-loop", "mcp-tools"],
      edges: [["retrieve", "agent-loop"], ["agent-loop", "mcp-tools"], ["mcp-tools", "agent-loop"], ["mcp-tools", "ledger"]],
    },
    { caption: "A call with side effects (sending mail) doesn't run. It's parked on a card, and the user's Send runs it with no model in the path.", nodes: ["card"], edges: [["agent-loop", "card"]] },
    { caption: "Then one call with no tools, so the model has to answer in words. Invented links are stripped, citations become chips, and the answer is written once.", nodes: ["persist"], edges: [["agent-loop", "persist"]] },
  ],
};

export interface Span {
  /** Row label in the trace. */
  name: string;
  /** What happened, terse. */
  detail: string;
  /** Start and duration in ms, for the waterfall bar. Illustrative. */
  at: number;
  ms: number;
  /** Diagram boxes and lines this span lights up. */
  nodes: string[];
  edges: Edge[];
  /** The reasoning, in a margin note. */
  why: string;
  /** Nesting under a loop round. */
  depth?: 0 | 1;
  tone?: "ok" | "warn" | "stop";
}

export interface Scenario {
  id: string;
  chip: string;
  ask: string;
  attachment?: string;
  spans: Span[];
  /** One line under the trace once it finishes. */
  moral: string;
}

const loop: Edge[] = [
  ["agent-loop", "mcp-tools"],
  ["mcp-tools", "agent-loop"],
  ["mcp-tools", "ledger"],
];

export const scenarios: Scenario[] = [
  {
    id: "deck",
    chip: "summarise a deck",
    ask: "Summarise the deck I just uploaded.",
    attachment: "board-review.pptx",
    moral: "The expensive part (reading pictures) happened once, at upload. The question itself cost an ordinary retrieval.",
    spans: [
      { name: "guards", detail: "ok", at: 0, ms: 4, nodes: ["question", "guards"], edges: [["question", "guards"]], why: "Checked before the 202. A bad request fails now, not later as an answer that looks broken." },
      { name: "resolve", detail: "1 file · 0 turns", at: 4, ms: 22, nodes: ["resolve", "history"], edges: [["guards", "resolve"], ["history", "resolve"]], why: "This deck had almost no text in it, so at upload its slides went to vision transcription instead of the text reader. Decided by text density, never by file extension." },
      { name: "retrieve", detail: "12 chunks", at: 26, ms: 140, nodes: ["retrieve", "vectors"], edges: [["resolve", "retrieve"], ["vectors", "retrieve"]], why: "One embedding of the question, top 12 chunks, from this conversation's files only. Scope is a partition key, not a filter applied afterwards." },
      { name: "round 1", detail: "no tool calls", at: 166, ms: 2100, nodes: ["agent-loop"], edges: [["retrieve", "agent-loop"]], why: "The retrieved slides were enough. The model is offered tools; it doesn't have to use them." },
      { name: "persist", detail: "1 block · 4 citations", at: 2266, ms: 60, nodes: ["persist"], edges: [["agent-loop", "persist"]], why: "Only sources the answer actually cites are shipped. A citation number the model invented is deleted, not shown." },
      { name: "ledger", detail: "2 calls metered", at: 2326, ms: 6, nodes: ["ledger"], edges: [], why: "Embedding and chat, both priced from the provider's own usage numbers. A token is never estimated." },
    ],
  },
  {
    id: "sheet",
    chip: "query a spreadsheet",
    ask: "Which region grew fastest last quarter?",
    attachment: "q3-plan.xlsx",
    moral: "Questions about spreadsheets are sums and joins. Those need an engine, not similarity search.",
    spans: [
      { name: "guards", detail: "ok", at: 0, ms: 3, nodes: ["question", "guards"], edges: [["question", "guards"]], why: "Same gate for every turn: size caps, rate limits, an injection guard. Cheapest checks first." },
      { name: "resolve", detail: "1 sheet · 3 tables", at: 3, ms: 30, nodes: ["resolve", "history"], edges: [["guards", "resolve"], ["history", "resolve"]], why: "A sheet is not a table; it is a page containing tables: side by side, stacked under banners. Each one was found and stored at upload." },
      { name: "retrieve", detail: "skipped", at: 33, ms: 1, nodes: ["retrieve"], edges: [["resolve", "retrieve"]], tone: "warn", why: "Retrieval answers 'what does row 400 say'. 'Which region grew fastest' is a GROUP BY." },
      { name: "round 1", detail: "query_table() → index", at: 34, ms: 900, nodes: ["agent-loop", "mcp-tools"], edges: loop, depth: 1, why: "Progressive discovery: first an index of tables, then columns on request, then SQL. An ordinary chat never pays for any of these schemas." },
      { name: "round 2", detail: "query_table(sql) → 6 rows", at: 934, ms: 1300, nodes: ["agent-loop", "mcp-tools"], edges: loop, depth: 1, why: "The model's SQL is untrusted input: one read-only statement, only this conversation's tables, no file functions. Refusals are written for the model, so it corrects itself next round." },
      { name: "final", detail: "tool-free", at: 2234, ms: 1500, nodes: ["agent-loop"], edges: [], why: "Total rows are flagged at upload and excluded in the query. A naive SUM over this kind of sheet reads exactly double." },
      { name: "persist", detail: "table + 2 lines", at: 3734, ms: 50, nodes: ["persist"], edges: [["agent-loop", "persist"]], why: "One block write. The answer is data the frontend renders, not HTML the model wrote." },
    ],
  },
  {
    id: "mail",
    chip: "mail it to the team",
    ask: "Mail that summary to the team.",
    moral: "Approval lives in the host, not in the tool. Nothing the model says can press Send.",
    spans: [
      { name: "guards", detail: "ok", at: 0, ms: 3, nodes: ["question", "guards"], edges: [["question", "guards"]], why: "The user's mail token rides a header for this request only. It is never a tool argument. A model that could set it could read someone else's mailbox." },
      { name: "resolve", detail: "last answer · 1 file", at: 3, ms: 20, nodes: ["resolve", "history"], edges: [["guards", "resolve"], ["history", "resolve"]], why: "History says what 'that summary' is, and which file the last turn made." },
      { name: "round 1", detail: "send_mail → parked", at: 23, ms: 1600, nodes: ["agent-loop", "mcp-tools"], edges: [["retrieve", "agent-loop"], ["agent-loop", "mcp-tools"]], depth: 1, tone: "warn", why: "send_mail declares requires_approval. Its arguments are parked on a card and the call does not run." },
      { name: "one more call", detail: "no tools offered", at: 1623, ms: 1100, nodes: ["agent-loop"], edges: [], why: "One tool-less call so the model can say what it prepared, and cannot call the tool a second time." },
      { name: "card", detail: "awaiting Send", at: 2723, ms: 40, nodes: ["card"], edges: [["agent-loop", "card"]], why: "The card's props are the call. Editing the card edits the call. The Send click runs it with a fresh token and no model in the path." },
    ],
  },
  {
    id: "news",
    chip: "search the web",
    ask: "What changed in the MCP spec this month?",
    moral: "Cost grows with every round re-sending the last one. So: a hard cap, one truncation point, and a cache.",
    spans: [
      { name: "guards", detail: "ok", at: 0, ms: 3, nodes: ["question", "guards"], edges: [["question", "guards"]], why: "Validated before anything is promised." },
      { name: "retrieve", detail: "nothing relevant", at: 3, ms: 120, nodes: ["retrieve", "vectors"], edges: [["guards", "resolve"], ["resolve", "retrieve"], ["vectors", "retrieve"]], why: "Retrieval logs its scores, because an empty result and a cut-off set too high look alike otherwise." },
      { name: "round 1", detail: "web_search ×2", at: 123, ms: 1700, nodes: ["agent-loop", "mcp-tools"], edges: loop, depth: 1, why: "Calls in one round run concurrently. Search results are compacted to title, date, url and a snippet." },
      { name: "round 2", detail: "web_fetch ×3 · truncated", at: 1823, ms: 2600, nodes: ["agent-loop", "mcp-tools"], edges: loop, depth: 1, tone: "warn", why: "Every result is cut at 8,000 characters in one place, not per tool: a schema costs ~250 tokens, a fetched page 6,000. Later rounds re-send the prefix from cache at a tenth of the price." },
      { name: "final", detail: "tool-free · 5 citations", at: 4423, ms: 2200, nodes: ["agent-loop"], edges: [], why: "At most four rounds, then one call with no tools at all, so the model has to answer in words." },
      { name: "no file round", detail: "skipped", at: 6623, ms: 1, nodes: [], edges: [], why: "You didn't ask for a PDF, so you don't get one. File tools are offered only when the request names a format." },
      { name: "persist", detail: "1 block", at: 6624, ms: 50, nodes: ["persist"], edges: [["agent-loop", "persist"]], why: "Links the model invented are stripped before the answer is saved, so a fake path can't be replayed as real next turn." },
    ],
  },
  {
    id: "stop",
    chip: "press stop",
    ask: "Research our top five competitors in depth.",
    moral: "A stop is not an error. It is a separate path, and it is tested as one.",
    spans: [
      { name: "guards", detail: "ok", at: 0, ms: 3, nodes: ["question", "guards"], edges: [["question", "guards"]], why: "Nothing special yet." },
      { name: "round 1", detail: "web_search ×5", at: 3, ms: 2400, nodes: ["agent-loop", "mcp-tools"], edges: [["guards", "resolve"], ["resolve", "retrieve"], ["retrieve", "agent-loop"], ...loop], depth: 1, why: "A long research turn, five searches in flight." },
      { name: "■ stop", detail: "lands on another worker", at: 1400, ms: 10, nodes: [], edges: [], tone: "stop", why: "The stop request can arrive at any server process. It sets a shared flag instead of hunting for the task." },
      { name: "poller", detail: "flag seen ≤ 1 s", at: 1410, ms: 900, nodes: ["agent-loop"], edges: [], tone: "stop", why: "One poller per worker, one call per tick no matter how many turns are running. Then the token is cancelled, in threads and in asyncio." },
      { name: "checkpoint", detail: "QueryCancelled", at: 2403, ms: 2, nodes: ["agent-loop"], edges: [], tone: "stop", why: "Raised at the next model call. It subclasses BaseException on purpose, so it sails past every `except Exception` that would have turned it into an error block." },
      { name: "persist", detail: "nothing published", at: 2405, ms: 1, nodes: [], edges: [], tone: "stop", why: "Checked immediately before anything reaches the user. The old bug: a stopped query that still wrote its result." },
      { name: "ledger", detail: "spend still recorded", at: 2406, ms: 4, nodes: ["ledger"], edges: [["mcp-tools", "ledger"]], why: "The calls that already ran were paid for, so they are metered. Shutdown drains the ledger first: a queued event is money already spent." },
    ],
  },
];
