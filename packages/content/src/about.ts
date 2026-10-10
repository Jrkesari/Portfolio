import type { PathEntry, Provenance } from "./types.ts";

/** The path so far, newest first, drawn like `git log --graph`. */
export const path: PathEntry[] = [
  { hash: "2026-10", date: "Oct 2026", branch: "netision", kind: "commit", title: "Self-hosted a 34B open model on one GPU to answer “should we?” with numbers", detail: "Tool use went from 1/8 to 8/8 after rewriting its chat template, and fell to 39/60 at 35 tools. The lever is a stronger tool-caller, not the template." },
  { hash: "2026-07", date: "Jul 2026", branch: "netision", kind: "commit", title: "Pulled four drifting copies of the model config into one library", detail: "Published by tag, never deployed. 86 releases by October." },
  { hash: "2026-04", date: "Apr 2026", branch: "netision", kind: "commit", title: "Wrote an observability platform's backends in Go and Python", detail: "Agents, a collector, a probe and a control plane, with exactly one process allowed out of the datacenter." },
  { hash: "2026-02", date: "Feb 2026", branch: "netision", kind: "commit", title: "First MCP server at work", detail: "Three architectures in eight months; it's now the tool layer for the whole platform." },
  { hash: "2025-07", date: "Jul 2025", branch: "netision", kind: "commit", title: "First commit on the analytics agents", detail: "Text-to-SQL over a read-only warehouse, then a root-cause agent. Peak month: 186 commits." },
  { hash: "2025-05", date: "May 2025", branch: "netision", kind: "merge", title: "AI Engineer, Netision Technology, Noida", detail: "Full-time. Agent runtimes, tool servers, LLM infrastructure." },
  { hash: "2024-12", date: "Dec 2024", branch: "internships", kind: "commit", title: "AI software trainee, Coginetics", detail: "Where I moved from web development to agents: LangChain, CrewAI, the OpenAI API." },
  { hash: "2024-08", date: "Aug 2024", branch: "main", kind: "commit", title: "Built a certificate generator and a mass mailer", detail: "A spreadsheet and a template in; certificates and emails out. The first thing I automated." },
  { hash: "2024-07", date: "Jul 2024", branch: "internships", kind: "branch", title: "Web development intern, Tech Freedom Online", detail: "Remote. Front end and back end." },
  { hash: "2022-09", date: "2022 – 25", branch: "main", kind: "commit", title: "BCA in Data Science, Bennett University", detail: "Graduated 9.6/10. First semester: a perfect 10. Also ran photography and multimedia for a few student societies." },
];

export interface ReceiptLine {
  label: string;
  value: string;
  source: Provenance | "public";
}

/** The receipt. Every line has a source; most live in private repos, so ask me about any of them. */
export const receipt: { lines: ReceiptLine[]; footer: ReceiptLine[] } = {
  lines: [
    { label: "GitHub contributions, 2026", value: "1,292", source: "public" },
    { label: "library releases, Jul–Oct", value: "86", source: "count" },
    { label: "models behind one interface", value: "17", source: "count" },
    { label: "first-party MCP tools", value: "49", source: "count" },
    { label: "test modules, query backend", value: "67", source: "count" },
    { label: "spreadsheet eval", value: "2/8 → 6/8", source: "eval" },
    { label: "guardrail blocks", value: "3/12 → 0/12", source: "measured" },
    { label: "root-cause turn", value: "77.8 s → 12 s", source: "measured" },
    { label: "pricing rewrite, golden cases", value: "308/308", source: "commit" },
  ],
  footer: [
    { label: "tokens estimated", value: "0", source: "doc" },
    { label: "unmeasured spend", value: "flagged", source: "doc" },
  ],
};

export const provenanceNote: Record<Provenance | "public", string> = {
  measured: "measured: run on the real system, from my commit or doc",
  eval: "eval: a fixed set of graded questions, same model and prompt",
  count: "count: counted from the code or git history",
  commit: "commit: stated in the commit that made the change",
  doc: "doc: a rule written in the design doc",
  public: "public: visible on my GitHub profile",
};

/** The toolbox, as `tree` would print it. */
export const toolbox: { dir: string; items: string[] }[] = [
  { dir: "agents", items: ["MCP (client & server)", "tool-calling loops", "LangGraph", "LangChain", "CrewAI"] },
  { dir: "models", items: ["Azure OpenAI", "Anthropic", "Gemini", "NVIDIA NIM", "prompt caching", "structured outputs", "vision"] },
  { dir: "backend", items: ["Python", "FastAPI", "asyncio", "Pydantic", "Go", "gRPC"] },
  { dir: "data", items: ["DuckDB", "SQLite + sqlite-vec", "ClickHouse", "Redpanda", "FAISS", "pandas"] },
  { dir: "platform", items: ["Docker", "Azure", "Microsoft Graph", "OpenTelemetry", "pytest", "uv"] },
  { dir: "front", items: ["TypeScript", "React", "TanStack", "Tailwind (this site)"] },
];

export const now = {
  updated: "2026-10-09",
  doing: [
    "Connectors for Zoho and Databricks: the plans are written and reviewed; nothing has touched a real account yet, so I'm not calling them done.",
    "A template engine that writes a new proposal in the exact design of an old one, and refuses to ship if a previous client's name leaks through.",
    "Measuring whether self-hosting an open model is worth it. So far the serving numbers are good, and tool use with many tools isn't.",
    "Making the test suite faster to trust: 246 s → 75 s locally by running it in parallel.",
    "This site: rebuilt with Claude Code, as a monorepo, and checked against the repos it describes.",
  ],
  thinking: [
    "What it takes for an agent to be trusted with someone's mailbox. (Mostly: the agent never holds the keys.)",
    "Whether tool calling degrades with the number of tools as sharply on other models as it did on the one I measured.",
  ],
  offline: [
    "Photography: a Nikon D5600 and an Insta360 X3. At university I ran photography and multimedia for a few student societies.",
  ],
};

export const uses = [
  {
    group: "Editor & agents",
    items: [
      { name: "VS Code", note: "with Claude Code alongside" },
      { name: "Claude Code", note: "with project skills I wrote: a release gate, a root-cause checklist, a token audit, a dependency audit" },
      { name: "CLAUDE.md as a decision log", note: "each rule written next to the incident that produced it" },
    ],
  },
  {
    group: "Python",
    items: [
      { name: "uv", note: "locks, pinned in CI" },
      { name: "pytest + xdist", note: "tests named as behaviours; no network, no real model" },
      { name: "FastAPI · asyncio · Pydantic", note: "`extra=\"forbid\"` on skills, knowledge packs and config" },
      { name: "DuckDB · SQLite · sqlite-vec", note: "local first, ClickHouse when it has to be shared" },
    ],
  },
  {
    group: "Everything else",
    items: [
      { name: "Go", note: "for things that run on someone else's machine" },
      { name: "pnpm + Turborepo", note: "this site, and the product's frontend" },
      { name: "GitHub Actions", note: "actions pinned to commit SHAs, an OSV audit on every PR" },
      { name: "Docker", note: "and build secrets mounted, never baked into a layer" },
    ],
  },
  {
    group: "Off the keyboard",
    items: [
      { name: "Nikon D5600", note: "stills" },
      { name: "Insta360 X3", note: "everything else" },
    ],
  },
];
