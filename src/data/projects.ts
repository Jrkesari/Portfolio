export type ProjectCategory = "ai" | "web";

export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  tech: string[];
  categories: ProjectCategory[];
  github?: string;
  live?: string;
  highlight?: string;
  /** Optional grouping label, e.g. the parent system a sub-project belongs to. */
  group?: string;
}

export const projects: Project[] = [
  {
    id: "netigen",
    name: "AI Agent Ecosystem",
    description:
      "A multi-agent platform: four standalone backends coordinating only through a shared Convex state bus, behind a Next.js frontend. The umbrella the agents below plug into.",
    longDescription:
      "Architected and built a multi-agent ecosystem of independently deployable backends that share nothing but a Convex state bus and a common 48-tool MCP server. Each surface owns its own pipeline; the frontend talks to each directly.",
    tech: ["LangGraph", "MCP", "Convex", "FastAPI", "Next.js", "Python"],
    categories: ["ai", "web"],
    highlight: "4 backends · 48 MCP tools · multi-LLM",
  },
  {
    id: "netigen-dock",
    name: "Dock — Agentic Tool Router",
    group: "Agent Ecosystem",
    description:
      "A LangGraph supervisor that routes a user query to the right MCP tools and custom sub-agents, with per-integration tool isolation enforced at request time.",
    longDescription:
      "Supervisor graph (supervisor → tool_caller → responder) that resolves an allowed-tool set per integration_id at request time, so each integration's LLM only ever sees the tools it's authorized for. Multi-provider LLM registry (Azure, NVIDIA NIM), async background pipeline that streams results into Convex.",
    tech: ["LangGraph", "MCP", "FastAPI", "Convex", "Azure OpenAI", "Python"],
    categories: ["ai"],
    highlight: "LangGraph supervisor · 48 tools · RBAC isolation",
  },
  {
    id: "power-agent",
    name: "Power BI Agent — NL → DAX",
    group: "Agent Ecosystem",
    description:
      "Natural-language questions over Power BI datasets: caches the semantic model, resolves entities against sampled values, generates and validates DAX, then renders Convex blocks.",
    longDescription:
      "Same approach as Power BI Copilot. Loads the semantic model once (XMLA INFO.VIEW + REST sampled values) into a cache, resolves dimension filter terms against sampled values with zero extra REST calls, generates DAX with DSPy + an LLM, validates and repairs invalid queries, executes via the Power BI executeQueries API, and formats Table/Card/FollowUp blocks the frontend renders reactively.",
    tech: ["DSPy", "Power BI REST", "XMLA", "LangGraph", "Python"],
    categories: ["ai"],
    highlight: "Semantic-model cache · DAX gen + repair",
  },
  {
    id: "netigen-desk",
    name: "Desk — Desktop AI Coworker",
    group: "Agent Ecosystem",
    description:
      "A local AI coworker that runs on the user's machine and executes tasks on their real files, driven through the cloud UI over a secure WebSocket bridge.",
    longDescription:
      "Local agent connected to the cloud platform via a secure WebSocket bridge. Users interact through the familiar cloud UI; the local agent executes on actual files and desktop, gated by confirmation/safety prompts and an MCP tool layer for extensibility.",
    tech: ["WebSocket", "MCP", "Python", "Local Agent"],
    categories: ["ai"],
    highlight: "Runs on real files · confirmation gates",
  },
  {
    id: "netigen-draft",
    name: "Draft — Document Generator",
    group: "Agent Ecosystem",
    description:
      "Skill-based document generation: takes a brief + a skill id, runs a structured pipeline, and pushes a renderable JSON spec to Convex.",
    longDescription:
      "Standalone backend that turns a user brief and a skill identifier into a renderable document spec. Sequential DraftGraph state machine (input parse → workspace load → memory load → generate), with per-session memory seeded from Convex and pushed back as block state.",
    tech: ["LangGraph", "Convex", "SQLite", "FastAPI", "Python"],
    categories: ["ai"],
    highlight: "Skill pipeline · block-spec output",
  },
  {
    id: "observability",
    name: "Observability Platform",
    description:
      "End-to-end VM/server observability: Go telemetry agents, a datacenter collector, an agentless discovery scanner, and a multi-tenant FastAPI control plane on ClickHouse + Redpanda.",
    longDescription:
      "Built across multiple repos: a per-VM Go agent (WAL-buffered, mTLS gRPC), a datacenter collector hub, a single-binary probe, an agentless network discovery scanner (ping/port-scan/fingerprint + SSH/WMI/SNMP enrichment), and a FastAPI ingestion gateway + console API. Telemetry streams through Redpanda into ClickHouse; the query API is hardened with an async CH pool, two-layer caching, per-tenant concurrency/CPU-s budgets, JWT tenant isolation, and AES-256-GCM encryption of install credentials at rest.",
    tech: ["Go", "FastAPI", "ClickHouse", "Redpanda", "OpenTelemetry", "gRPC", "Python"],
    categories: ["web", "ai"],
    highlight: "Go agents · multi-tenant · ClickHouse + Redpanda",
  },
  {
    id: "splitcash",
    name: "SplitCash",
    description:
      "Voice-powered expense splitting with Hindi language support. Speak naturally about transactions — parsed and logged automatically.",
    longDescription:
      "Full-stack voice-to-database pipeline supporting Hindi speech input. Switchable STT providers (Whisper, Google, Azure) and LLMs (Claude, OpenAI). Automatic ledger calculation for group expenses.",
    tech: ["FastAPI", "DuckDB", "LangChain", "Claude API", "Next.js", "TypeScript"],
    categories: ["ai"],
    highlight: "Whisper · Hindi NLP · LangChain agents",
  },
  {
    id: "webchat",
    name: "Webchat",
    description:
      "Intelligent web scraping platform with MCP integration. Detects and adapts to static, dynamic, and bot-protected sites automatically.",
    longDescription:
      "Production-ready scraper that identifies site type (static, React/Vue SPA, Cloudflare-protected) and selects the right strategy. Supports MCP protocol for agent integration.",
    tech: ["Python", "Playwright", "BeautifulSoup", "FastAPI", "MCP"],
    categories: ["ai"],
    highlight: "MCP integration · Stealth scraping",
  },
  {
    id: "nexus-mcp",
    name: "Nexus MCP",
    description:
      "Modular MCP server for social media and brand intelligence. Registry-driven tool registration with per-agent governance.",
    longDescription:
      "Centralized SurrealDB-backed MCP server providing scrape_social_media, get_engagement_metrics, analyze_posts tools. Per-agent tool authorization and audit logging.",
    tech: ["Python", "SurrealDB", "MCP", "Apify", "FastAPI"],
    categories: ["ai"],
    highlight: "Multi-agent tool governance",
  },
];
