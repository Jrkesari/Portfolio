import { llmCallFigure, localAgentFigure, rcaFigure, telemetryFigure, toolServerFigure } from "./figures.ts";
import { turnPipeline } from "./replay.ts";
import { routerFigure, routerScenarios } from "./router.ts";
import { telemetryScenarios } from "./telemetry.ts";
import type { System } from "./types.ts";

// Employer work is described at the level of architecture and decisions —
// no client names, no internal hostnames, no source. Numbers come from my own
// commit messages, docs and tests; each carries where it came from.

export const systems: System[] = [
  {
    slug: "query-backend",
    name: "The query backend",
    where: "Netision · 2025–26",
    year: "2026",
    role: "Primary author, about 87% of 1,620 commits",
    oneLiner: "The service that answers every question in an enterprise AI workspace: one capped agent loop, tools by contract, approval in the host, every token metered.",
    summary:
      "A FastAPI service behind the chat of an enterprise AI workspace. It resolves the documents a question is about, retrieves what it needs, runs a capped tool-calling loop over an MCP tool server, parks anything with side effects behind a human approval, and writes the answer as data the frontend renders. It started as a document drafter and became the core LLM backend of the product.",
    stack: ["Python", "FastAPI", "asyncio", "MCP", "SQLite + sqlite-vec", "DuckDB", "Convex", "Microsoft Graph", "pytest"],
    diagram: turnPipeline,
    metrics: [
      { label: "graded spreadsheet questions", before: "2/8", after: "6/8", source: "eval", note: "after table discovery became progressive: index, then columns, then SQL" },
      { label: "test modules", after: "67", source: "count", note: "1,371 tests after the October consolidation" },
      { label: "ledger events with usage and a price", after: "246/246", source: "measured", note: "live check after agents became tools (about 15 turns)" },
    ],
    sections: [
      {
        heading: "The motive",
        paragraphs: [
          "A workspace where people ask questions about their own documents, mail and data needs one place that decides what a question needs, calls the right tools, and can be trusted with the user's accounts. It also needs to say what each answer cost.",
          "It began in May 2026 as a skill-based document drafter. From July I rebuilt it on a shared library I wrote ([see the LLM library](/work/llm-library)) into the backend that runs every chat turn, and merged in the analytics agents I had been building since July 2025.",
        ],
      },
      {
        heading: "How a turn runs",
        bullets: [
          "**Validate before the 202.** Unknown model, unknown agent, empty prompt: refused synchronously. A 202 followed by an error block reads to the user as the agent failing, not as a bad request.",
          "**Resolve and retrieve.** History, tagged files and workspace documents. One embedding, top 12 chunks from this conversation's scope.",
          "**The loop.** At most four rounds. Tool calls in a round run concurrently; every result is cut to 8,000 characters at one choke point. Then one call with no tools at all, so the model has to answer in words.",
          "**Persist.** Invented links are stripped before the answer is saved, citations become chips, files are filed by id (never by URL), and the answer is one block write.",
          "**Meter.** Every chat call, embedding, vision page, OCR page and generated image lands in a per-user ledger.",
        ],
      },
      {
        heading: "Decisions",
        bullets: [
          "**Tags, not tool names.** Tools declare `produces_file`, `requires_approval`, `connector:<id>`, `format:<word>` in their MCP metadata. New tools ship with one allowlist word, or no change here at all.",
          "**Credentials ride headers, never arguments.** Tool arguments are model-controlled and re-sent in history. A model that could set a token could read another person's account.",
          "**Approval lives in the host.** A send-mail call is parked on a card whose props *are* the call; the Send click runs it with a fresh token and no model in the path. I wrote the design; a teammate built the first version.",
          "**A skill is an extra prompt and nothing else.** One system message after the history. Same loop, same tools. So a skill can't quietly change how files get made.",
          "**Agents are tools inside the loop.** The analytics agents used to bypass the chat loop, so 'show me the sales' then 'mail it' re-ran the SQL. Now one loop holds connectors, files and agents.",
        ],
      },
      {
        heading: "Ruled out",
        rejected: [
          { option: "Retry a call the guardrail blocked", why: "A blocked call is billed its whole prompt, and a second one clears nothing." },
          { option: "Offer every file tool on every turn", why: "Research and delivery compete for the same round budget. Gated on the words in the request, a news question stopped returning an unasked-for PDF." },
          { option: "Keep the warehouse on blob storage", why: "Shipped, measured fast when warm, then reverted: it ran out of memory on a small VM with nowhere to spill." },
        ],
      },
      {
        heading: "What this doesn't fix",
        paragraphs: [
          "Conversation memory is process-local SQLite: fine at one or two queries a second per process, wrong for many replicas. That limit is written down where the next person will look, along with what would have to change.",
        ],
      },
    ],
    private: true,
  },
  {
    slug: "llm-library",
    name: "One library, not four copies",
    where: "Netision · 2026",
    year: "2026",
    role: "Created and sole maintainer, 100 of 100 commits",
    oneLiner: "The shared LLM layer every backend installs: 17 models behind one interface, a Stop that actually stops, and a billing-grade ledger.",
    summary:
      "The model config had been copy-pasted into four repositories and had drifted. One copy was about 2,500 lines away from another. I pulled it into a versioned Python library: published by git tag, never deployed. It now holds the model switchboard, document ingestion, the table store, cancellation, observability and the cost ledger. 86 releases in three months.",
    stack: ["Python 3.12", "uv", "asyncio", "provider APIs", "DuckDB", "sqlite-vec", "ClickHouse", "OpenTelemetry"],
    diagram: llmCallFigure,
    replay: {
      title: "Where does an upload go?",
      lede: "Pick a file and watch the document router decide: by what's in it, not what it's called.",
      noun: "upload",
      choose: "Choose a file to upload",
      diagram: routerFigure,
      scenarios: routerScenarios,
    },
    metrics: [
      { label: "releases", after: "86", source: "count", note: "tags on the shared remote, v0.1.0 → v0.59.1, July–October 2026" },
      { label: "chat models behind one interface", after: "17", source: "count", note: "6 providers in use, 8 provider routes, plus 2 image providers" },
      { label: "guardrail blocks on the same payload", before: "3/12", after: "0/12", source: "measured", note: "one confidentiality line instead of three" },
      { label: "pricing rewrite, golden cases identical", after: "308/308", source: "commit", note: "an equivalence check against cases captured before the change" },
    ],
    sections: [
      {
        heading: "The motive",
        paragraphs: [
          "A fix or a new model added in one repository never reached the others. **This is a library, not a service**: published as a git tag, installed at build time, configured by the app at runtime. Apps pin an exact version, so a bad release can never cascade until an app opts in.",
        ],
      },
      {
        heading: "Decisions",
        bullets: [
          "**Model chosen per request, through a context variable.** Set once at the request boundary, so nothing in between threads a model argument it doesn't use.",
          "**Per-model settings live beside each model.** One environment variable used to tune every model at once, which is how one model got mistuned to satisfy another.",
          "**No house output cap.** A global 4,096-token cap cut long structured answers mid-object; a larger one made every Claude call fail. Each model now gets its own maximum.",
          "**Stop is a `BaseException`.** Pipelines are full of `except Exception` blocks that turn failures into error messages. And a stop is not an error. The proxy checks before every model call with no wiring at the call site; because a cached response skips that check, pipelines also check again right before they publish.",
          "**Route documents by content, not extension.** Below 150 characters a page, a file is pictures: it goes to vision transcription once, at upload. Two real decks had 52 and 168 characters of text in total.",
          "**Free, unpriced and unmeasured are three different states.** A zero for a payload nobody could read is how spend goes missing quietly.",
        ],
      },
      {
        heading: "Ruled out",
        rejected: [
          { option: "Comment out models that stopped answering", why: "A dead entry reads as a working option and costs the caller a 404 at runtime, not at deploy. Seven of eight entries were dead when I checked; now every entry is called live before it's listed." },
          { option: "Filter vector search by scope after the search", why: "A two-chunk file in a 435-chunk store returned nothing. Scope became a partition key; existing stores migrated without re-embedding anything." },
          { option: "Trust the model's SQL because the prompt says 'read only'", why: "Two independent defences instead: a locked-down connection and a statement check. Either alone would probably hold. Neither alone is worth betting a filesystem on." },
        ],
      },
      {
        heading: "What this doesn't fix",
        paragraphs: [
          "Every change costs a release, so apps get `register_model()` and reader registries for things only they need. Some models are wired but unverified in production, and they're labelled that way.",
        ],
      },
    ],
    private: true,
  },
  {
    slug: "tool-server",
    name: "The MCP tool server",
    where: "Netision · 2026",
    year: "2026",
    role: "Architect and main author, ~98% of current lines",
    oneLiner: "The shared hands of an agent platform: 49 tools in 20 packages, where tools declare what they are and credentials never become arguments.",
    summary:
      "A Model Context Protocol server over Streamable HTTP: web research, six file generators, and 13 per-user connectors across Microsoft 365, Power BI, Google Workspace, Zoho and Databricks. And it can mount external MCP servers behind the same front door. It went through three architectures in eight months.",
    stack: ["Python", "FastMCP", "MCP", "Streamable HTTP", "Microsoft Graph", "Playwright", "reportlab", "pytest"],
    diagram: toolServerFigure,
    metrics: [
      { label: "first-party tools", after: "49", source: "count", note: "in 20 capability packages" },
      { label: "connectors", after: "13", source: "count", note: "across 5 providers" },
      { label: "a PDF in the tool result", before: "~170k tok", after: "~30 tok", source: "doc", note: "files by reference, not base64" },
      { label: "unused tools deleted in one pass", after: "22", source: "commit" },
    ],
    sections: [
      {
        heading: "The motive",
        paragraphs: [
          "Every agent in the platform needs the same hands (search the web, write a deck, read a mailbox), and none of them should have to hard-code what a tool does, or hold a user's credentials. The server executes tools; it does not run conversations.",
        ],
      },
      {
        heading: "Three architectures in eight months",
        bullets: [
          "**February:** a single-file social-media intelligence server for Claude Desktop and Cursor.",
          "**March:** a modular monolith on SurrealDB with per-agent tool permissions.",
          "**May onwards:** a plugin registry (drop a folder, get a module, zero core changes), and later the tag contract, delegated-token connectors and files by reference.",
        ],
      },
      {
        heading: "Decisions",
        bullets: [
          "**Tools are named by capability, not by consumer.** `web_tools`, `pdf_tools`, `deck_tools`. Never a folder named after the agent that happens to call it.",
          "**Codes, never wording.** A tool declares which vocabulary entry it belongs to (`searching_web`, `web_search`); the frontend owns every user-facing word.",
          "**Identity, credentials, host and turn are never tool arguments.** One that could set the turn could claim the user approved something they never saw. A test pins it: no tool takes a user, a token or a host.",
          "**Strip before you proxy.** External MCP servers receive every forwarded header, so the user's token is removed before anything reaches them.",
          "**Least privilege by construction.** Drive declares read scopes only. Consent can't grant a write scope nobody asked for.",
        ],
      },
      {
        heading: "What this doesn't fix",
        paragraphs: [
          "The service check proves the caller is one of our services and says nothing about whose data it reads. User auth stays the caller's job, by design. Some connectors are built against plans that haven't met a real account yet, and they're marked that way.",
        ],
      },
    ],
    private: true,
  },
  {
    slug: "analytics-agents",
    name: "Analytics agents, router to picker",
    where: "Netision · 2025–26",
    year: "2025",
    role: "Primary author, 478 of 515 commits on these paths",
    oneLiner: "Text-to-SQL analysts and a root-cause agent for multi-brand retail, and what was left when the LLM router went.",
    summary:
      "My first year at Netision: conversational BI over a read-only warehouse. A sales analyst that plans, writes and guards SQL, injects row-level security and scores its own answer; a root-cause agent that explains why stores moved. In 2026 a two-level LLM router was put in front of nine specialist agents; four months later the product consolidated onto one chat backend, and the agents became tools inside its loop.",
    stack: ["Python", "LangGraph", "DuckDB", "SQL guardrails", "FastAPI", "Convex"],
    diagram: rcaFigure,
    metrics: [
      { label: "root-cause turn", before: "77.8 s", after: "12 s", source: "measured", note: "20,161 → 11,809 tokens, report unchanged" },
      { label: "trust score", before: "1 LLM call", after: "0", source: "commit", note: "made deterministic; a 12 s scan became sub-millisecond" },
      { label: "client identifiers in agent code", before: "238", after: "0", source: "doc", note: "after moving config into knowledge packs" },
      { label: "tests", before: "759", after: "936", source: "doc" },
    ],
    sections: [
      {
        heading: "The motive",
        paragraphs: [
          "People in retail ask 'storewise sales versus last year' or 'why are these stores declining' in plain English, and expect a table they can trust, not a paragraph that sounds right.",
        ],
      },
      {
        heading: "Decisions",
        bullets: [
          "**Deterministic code where a decision can be computed.** The trust score became the share of the answer's bolded numbers that the fact sheet supports. One fewer model call per question.",
          "**Row-level security goes into the last `WHERE`.** Not a subquery wrapper, because the store column usually isn't selected. Deny by default.",
          "**One codebase, many clients, no fork.** A base pack plus client deltas, validated at boot. Collapsing the duplicates surfaced bugs nobody had seen, like an 'average' column that never matched and got summed.",
          "**From an LLM router to a picker.** When the product moved to one chat backend where the user picks the agent, the classifier went: a dictionary is now the only place a name maps to a pipeline, and routing is deterministic as a side effect.",
        ],
      },
      {
        heading: "Ruled out",
        rejected: [
          { option: "Batch every store family into one model call", why: "Input fell 56%, but wall time went from 5.8 s to 15.8 s: one long serial decode. Kept the fan-out with a cacheable shared prefix." },
          { option: "Move to LangGraph to cut tokens", why: "The waste wasn't orchestration. It was teaching the model the same rules twice." },
          { option: "Minimal reasoning effort everywhere", why: "Low effort on the two prose stages took one step from 28.4 s to 8.2 s. 'Minimal' produced malformed output, and the deciding call was left alone." },
        ],
      },
    ],
    private: true,
  },
  {
    slug: "observability",
    name: "Observability, outbound only",
    where: "Netision · 2026",
    year: "2026",
    role: "Designed and built the backends: Go agent, collector, probe, control plane",
    oneLiner: "Telemetry from machines inside a customer's network, where exactly one process is allowed to talk to the internet.",
    summary:
      "An on-prem observability platform, built between March and May 2026. A Go agent on each machine, a Go collector per datacenter, a standalone probe, agentless discovery, and a FastAPI control plane on Redpanda and ClickHouse. The console UI was built by teammates.",
    stack: ["Go", "OpenTelemetry Collector", "gRPC + mTLS", "BadgerDB", "FastAPI", "Redpanda", "ClickHouse"],
    diagram: telemetryFigure,
    replay: {
      title: "What happens when the uplink drops?",
      lede: "Pick a moment and watch the pipeline handle it: telemetry inside a network that only lets one thing out.",
      noun: "moment",
      choose: "Choose a moment to replay",
      diagram: telemetryFigure,
      scenarios: telemetryScenarios,
    },
    metrics: [
      { label: "metrics flowing to ClickHouse, first real pipeline", after: "47k+ in 10 min", source: "commit" },
      { label: "processes that egress from the datacenter", after: "1", source: "doc" },
      { label: "commits across the five repos", after: "116", source: "count" },
    ],
    sections: [
      {
        heading: "The motive",
        paragraphs: [
          "Infrastructure teams want monitoring without opening their network. So the design starts from the firewall: one machine needs outbound :443, and every other machine stays locked down.",
        ],
      },
      {
        heading: "Decisions",
        bullets: [
          "**Pure pull.** The cloud never connects into the customer network, and the collector never connects to agents. Config arrives because something asked for it.",
          "**Write-ahead log first, and honest about its gaps.** The collector writes every batch to disk and deletes it only when the cloud acknowledges it. What it doesn't do yet: re-send a batch that ran out of retries before the next restart. The agents' own log doesn't replay at all, so a failed push can drop the batch in flight. The code comments say so; the README still promises more, and that's next on my list.",
          "**Rewrite once the shape was clear.** The first prototype wrapped an external collector binary in Python. After two weeks it was deleted for a Go agent that embeds the collector library in-process.",
          "**Plan, then execute.** Each repository started as a plan document, then one commit per step. Working with Claude Code, the control plane went through eight planned phases in a day.",
        ],
      },
      {
        heading: "What this doesn't fix",
        paragraphs: [
          "Keeping control-plane state in ClickHouse is a contested call. Postgres has a real case there (concurrency, revocation lag), and I'd revisit it before the fleet grows.",
        ],
      },
    ],
    private: true,
  },
  {
    slug: "local-agent",
    name: "A coworker on your own machine",
    where: "Netision · 2026",
    year: "2026",
    role: "Prototype: the local agent and the cloud bridge (9 of 9 commits); the product UI was never wired",
    oneLiner: "A local agent designed to work on your real files through the web app you already use, and to never do anything destructive without a yes.",
    summary:
      "A desktop agent that dials out to a cloud bridge over a WebSocket. The idea: people keep using the familiar web interface while the agent lists, finds, reads and summarises files on their machine, and turns anything that writes into a plan they approve. The agent and the bridge exist; the product never wired up a screen for them.",
    stack: ["Python", "WebSocket", "asyncio"],
    diagram: localAgentFigure,
    metrics: [{ label: "destructive actions without approval", after: "0", source: "doc", note: "by design: reads run, writes wait" }],
    sections: [
      {
        heading: "The idea",
        paragraphs: [
          "'Tidy up my Downloads folder', 'find last month's electricity bill', 'summarise this document'. The agent always asks before anything destructive: reads execute immediately; write, move and delete show a preview plan and wait for an explicit approval.",
        ],
      },
    ],
    private: true,
  },
];

/** Earlier, smaller and personal work — a list, not case studies. */
export const earlier = [
  { name: "Webchat", year: "2025", what: "An MCP server that exposes web scraping to any MCP client, probing in parallel to work out whether a site is static, a client-rendered app or bot-protected, then picking a strategy.", stack: "Python · Playwright · BeautifulSoup · MCP" },
  { name: "SplitCash", year: "2025", what: "Voice to ledger: Hindi speech transcribed, translated and turned into structured expense entries. Five speech-to-text and three LLM providers behind one interface.", stack: "LangChain · DuckDB · multi-provider STT" },
  { name: "Automation suite", year: "2025", what: "25+ CrewAI agents with shared memory and delegation for lead generation, SEO and content, from raw input to Excel and Markdown reports.", stack: "CrewAI · Gemini · pandas" },
  { name: "Certificate generator & mass mailer", year: "2024", what: "A student's first automation: a spreadsheet and a Word template in; personalised certificates and emails out.", stack: "Tkinter · python-docx · SMTP", href: "https://github.com/Jrkesari/Mass-Generator-Mailing" },
  { name: "Airline review analysis", year: "2024", what: "Scraped reviews, scored sentiment, correlated it with service categories, and generated the slide deck automatically.", stack: "requests · BeautifulSoup · TextBlob · python-pptx", href: "https://github.com/Jrkesari/Airline-Review-Analysis" },
];
