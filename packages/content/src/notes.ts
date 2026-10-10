import type { NoteMeta } from "./types.ts";

// Field notes. Written from my own design docs, commit messages and tests —
// `status: "draft"` until I've read each one end to end and signed it off.

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "quote"; text: string }
  | { t: "list"; items: string[] }
  | { t: "fig"; src: string; caption: string };

export interface Note extends NoteMeta {
  status: "draft" | "published";
  blocks: Block[];
}

export const notes: Note[] = [
  {
    slug: "unmeasured-is-not-zero",
    title: "Unmeasured is not zero",
    date: "2026-10-09",
    minutes: 5,
    tags: ["cost", "observability"],
    status: "draft",
    summary: "What I learned building a per-user ledger for every token, page and image an AI service pays for, and why “we don't know” has to be a value.",
    blocks: [
      { t: "p", text: "For a while, the honest answer to “what did this turn cost?” was “some of it”. Chat calls were logged against a user named after the service itself. Embeddings, OCR pages, vision pages and generated images weren't metered at all. One model was costed at a fifth of its invoice." },
      { t: "p", text: "None of that raised an error. That's the trouble with spend: when it goes missing, nothing breaks. Nothing 500s, no test goes red, nobody complains. The money just stops being attributable." },
      { t: "h", text: "One event for everything we pay for" },
      { t: "p", text: "The ledger has one event shape for everything that's billed: a chat call, an embedding, a vision page, an OCR page, a generated image. The question it answers isn't “how many tokens” but “what did this turn cost”. So every event says who it was for: the user, the turn, the stage, the document." },
      { t: "p", text: "That identity is set once, at the request boundary, in a context variable, so a meter can't forget who it bills. Python doesn't carry context variables into a thread pool, so the one place that fans work out to threads re-binds it explicitly. And a test fails on any raw `submit()` that would leak spend to nobody." },
      { t: "h", text: "A token is never estimated" },
      { t: "p", text: "Numbers come only from the provider's own usage payload. Providers report usage in at least four shapes, so one reader normalises them all, including cached-input and reasoning tokens, which are the easiest to drop. A call that failed after generating was still billed, so usage is read off the exception too." },
      { t: "h", text: "Three states, not one" },
      {
        t: "fig",
        caption: "fig. · a zero is a claim. These are three different facts.",
        src: String.raw`
 payload read, model priced   ─▶  cost
 payload read, no rate        ─▶  pricing_missing
 payload unreadable           ─▶  usage_missing`,
      },
      { t: "p", text: "A zero means “this cost nothing”. A payload nobody could read isn't zero, it's unknown. So it's recorded as `usage_missing`. A model with no rate isn't free, it's unpriced: `pricing_missing`. At startup the service names every model it can spend on that has no price, so the invoice is never the first to tell us." },
      { t: "h", text: "One rate table" },
      { t: "p", text: "There used to be two pieces of arithmetic for cost: the ledger's, and an older diagnostics path with its own private rate table. They disagreed for months. The dashboard and the invoice told different stories. I folded them into one function and checked it against 308 cases captured before the change. All 308 came out identical, which is the only way I'd ship a change to money." },
      { t: "h", text: "What it caught" },
      { t: "list", items: [
        "a model under-costed five times against its invoice;",
        "OCR under-reported 6.7×: an environment variable changed the price, but not the model actually called;",
        "generated images recorded as free, because one provider bills per megapixel;",
        "cancelled image generations that were billed and invisible, because cancellation is a `BaseException` and slipped past the meter.",
      ] },
      { t: "p", text: "Every one of them had been silent." },
      { t: "h", text: "If you're building one" },
      { t: "p", text: "Make “we don't know” a value. Put identity in the request, not in the call. Keep rates as data with dates on them, so a promotional price can't bill past its end. And when two numbers must agree, delete one of them." },
    ],
  },
  {
    slug: "spreadsheets-are-not-documents",
    title: "Spreadsheets are not documents",
    date: "2026-10-09",
    minutes: 5,
    tags: ["retrieval", "sql", "safety"],
    status: "draft",
    summary: "Why chunk-and-embed fails on spreadsheets, what replaced it, and the two independent locks on SQL a model writes.",
    blocks: [
      { t: "p", text: "The first version treated a spreadsheet like a PDF: chunk it, embed the chunks, retrieve the nearest ones. It was very good at “what does row 400 say”. Nobody asks that." },
      { t: "p", text: "People ask “which region grew fastest”, “total spend by channel”, “compare this plan with last quarter's”. Those are sums, group-bys and joins. Similarity search doesn't add up columns." },
      { t: "h", text: "A sheet is not a table" },
      { t: "p", text: "Real files don't look like CSVs. A media plan is a sheet *containing* tables: side by side, stacked under banner rows, with two-level headers and totals in the middle. Measured on four real plans, a standard reader returned one column and zero rows for a side-by-side sheet; another returned twenty-three columns called `Unnamed`. Neither is a bug in those libraries. They answer “read the table”, and the question here is “find the tables”." },
      { t: "p", text: "So detection comes first: split on blank rows and spacer columns, treat banner rows as titles, fold two-level headers into names, and flag total rows by their label *and* by arithmetic, because not every total says it's one." },
      { t: "h", text: "Query, don't retrieve" },
      {
        t: "fig",
        caption: "fig. · progressive discovery. Each step costs only what it needs.",
        src: String.raw`
 query_table()            ─▶  index of tables, one line each
 query_table(table=…)     ─▶  columns, with concept and how to aggregate
 query_table(sql=…)       ─▶  rows, capped, flagged if truncated`,
      },
      { t: "p", text: "Each detected table lands in DuckDB, scoped to the conversation, and only a short schema card per table is embedded. The model discovers progressively: the index, then columns on request, then SQL. An ordinary chat never pays for any of it. The tool is only offered when a data file is attached." },
      { t: "p", text: "On a graded set of eight real questions: **2/8 before, 6/8 after**. The jump came once discovery stopped overrunning the 8,000-character cut on tool results." },
      { t: "h", text: "Totals read double" },
      { t: "p", text: "One plan summed to exactly twice its real figure: the total rows were being added to the rows they total. Because totals are flagged at upload, the query excludes them. The sum is corrected in the query, not in the answer." },
      { t: "p", text: "A related trap: columns that look alike but aren't. *Potential*, *planned* and *achieved* reach must never be added together, and a rate is weighted by what it's a rate of. An average of averages is silently plausible and wrong. So the column cards carry a concept, a qualifier and an aggregation rule, decided by code, not by the model." },
      { t: "h", text: "The SQL is untrusted" },
      { t: "p", text: "DuckDB can read files. `read_csv('/etc/passwd')` is valid SQL. Any SQL a language model writes is untrusted input, no matter how the prompt is worded. So there are two independent defences:" },
      { t: "list", items: [
        "the connection is locked down before it's used (no external access, configuration frozen), and the store refuses to open if it can't verify that;",
        "every statement is checked: exactly one, read-only, no file functions, and only tables that belong to this conversation. The catalog table is excluded too. One `SELECT * FROM _catalog` would leak every other conversation's schema.",
      ] },
      { t: "quote", text: "Either alone would probably hold. Neither alone is worth betting a filesystem on." },
      { t: "p", text: "The refusals are written for the model, not for a log: they say what was wrong and what's allowed, so the next round fixes the query instead of giving up." },
    ],
  },
  {
    slug: "never-hand-the-model-the-keys",
    title: "Never hand the model the keys",
    date: "2026-10-09",
    minutes: 6,
    tags: ["agents", "safety", "mcp"],
    status: "draft",
    summary: "How an agent can work in someone's mailbox without the model ever holding their credentials, and the four-times “send it?” bug that moved approval out of the tool.",
    blocks: [
      { t: "p", text: "An agent that can read someone's mail has to answer one question before any other: *who decides whose mail it reads?* If the answer is “the model”, you've already lost." },
      { t: "h", text: "Arguments belong to the model" },
      { t: "p", text: "Tool arguments are written by the model, and they live in the conversation history, re-sent every round. Anything in them is something the model chose, or could be talked into choosing." },
      {
        t: "fig",
        caption: "fig. · what the model may set, and what it may not.",
        src: String.raw`
 ┌──────────────┐  headers: user · token · model · turn
 │  agent host  │───────────────────────────────────────▶
 └──────────────┘  arguments: query · recipients · body`,
      },
      { t: "p", text: "So identity, the user's delegated token, the chosen model, the turn and even the API host travel as headers into context variables on the tool server, never as arguments. A model that could set the first two could read another person's account. One that could set the turn could claim the user approved something they never saw. A test fails if any tool ever takes a user, a token or a host." },
      { t: "h", text: "The token lives for one request" },
      { t: "p", text: "The frontend refreshes the user's provider token when they submit. The backend holds it for that request and forwards it only to that connector's tools. It's never logged, never stored, never written into an answer. And when the tool server forwards a call to a third-party MCP server, it strips the token header first." },
      { t: "h", text: "The “send it?” loop" },
      { t: "p", text: "The first approval design held the email inside the tool: compose it, hold it, send when the user says yes. Someone asked four times, and nothing was sent." },
      { t: "p", text: "The hold was keyed on the exact text, and the model re-composed a slightly different body on every turn, so no yes ever matched the held draft. That drift is not cosmetic. It *is* the bug. The tests had used one-to-five-word bodies, so it never showed." },
      { t: "h", text: "Approval lives in the host" },
      { t: "p", text: "The fix moved approval out of the tool and into the host. We own the host, so we can stop working around its absence. A tool tagged `requires_approval` doesn't run. Its arguments are parked on a card and the turn ends with one tool-less call, so the model can say what it prepared and can't call the tool again." },
      { t: "list", items: [
        "the card's props *are* the call: editing the card edits the call;",
        "Send runs it once, with a fresh token, under a claim so only one click wins;",
        "there's no model anywhere on the Send path;",
        "scheduled runs that nobody is watching are never offered the tool at all.",
      ] },
      { t: "p", text: "I wrote this design; a teammate built the first version of it, and I've extended it since: replies, attachments, and routing each card to the right provider's account." },
      { t: "h", text: "Least privilege, by construction" },
      { t: "p", text: "Permissions are declared by each connector, not granted in bulk. File access asks for read scopes only. Consent can't grant a write scope nobody asked for. Teams gets its own switch even though it shares Outlook's sign-in, because turning mail off has to mean chats are unreachable too." },
      { t: "p", text: "None of this makes the model more careful. It makes being careless harmless." },
    ],
  },
];
