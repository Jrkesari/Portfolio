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
}

export const projects: Project[] = [
  {
    id: "nexus",
    name: "Nexus",
    description:
      "Enterprise business intelligence platform with natural language to SQL, custom graph generation, and multi-LLM support.",
    longDescription:
      "Conversational analytics platform that converts natural language queries to validated SQL with a 4-stage graph visualization pipeline achieving 95%+ accuracy. Reduced token usage by 53.5% ($22,740/month savings) and query response time by 40% through intelligent caching.",
    tech: ["FastAPI", "LangChain", "CrewAI", "DuckDB", "Azure OpenAI", "MCP", "Python"],
    categories: ["ai", "web"],
    highlight: "53.5% token reduction · $22,740/mo savings",
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
    github: "https://github.com/Jrkesari/splitcash",
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
    github: "https://github.com/Jrkesari/webchat",
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
  {
    id: "obsi",
    name: "Vantage (OBSI)",
    description:
      "VM observability platform — connect any server in under 2 minutes via SSH and get live dashboards for 20+ system metrics.",
    longDescription:
      "Automated 8-step deployment pipeline: SSH credentials → agent install → OTel Collector setup → systemd service → live ClickHouse-backed dashboards. 15-second refresh cadence, hot-reload Prometheus scrape targets, multi-VM support.",
    tech: ["FastAPI", "Python", "OpenTelemetry", "ClickHouse", "Next.js", "TypeScript"],
    categories: ["web"],
    highlight: "Sub-2min onboarding · 20+ OTel metrics",
  },
  {
    id: "aireviewhub",
    name: "AiReviewHub",
    description:
      "Review platform for tools and services built with Spring Boot. Categorized reviews helping developers discover and evaluate options.",
    longDescription:
      "Full-stack review platform with categorized entries, ratings, and discovery features.",
    tech: ["Spring Boot", "Java", "MySQL", "React"],
    categories: ["web"],
    github: "https://github.com/Jrkesari/AiReviewHub",
  },
  {
    id: "workwise",
    name: "WorkWise",
    description:
      "Job matching platform connecting seekers with meaningful opportunities focused on decent work and economic growth.",
    longDescription:
      "Full-stack job matching platform with smart filtering and matching algorithms promoting equitable employment.",
    tech: ["React", "Node.js", "MongoDB"],
    categories: ["web"],
    github: "https://github.com/Jrkesari/workwise",
  },
];
