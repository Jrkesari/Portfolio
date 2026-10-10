// The résumé, as data — rendered at /resume, printed to PDF, and exported as
// JSON Resume. Mirrors my LaTeX résumé (Aug 2026), with counts updated to what
// the code says today. Bullets say "from X to Y" in words, which résumé parsers
// and screen readers handle better than an arrow.

export const resume = {
  title: "AI Engineer · Agentic Systems & LLM Infrastructure",
  summary:
    "AI engineer building production agentic systems since 2024. I work on the LLM platform behind a multi-tenant enterprise product: model routing across providers, an MCP tool server, RAG over documents and spreadsheets, and token-level cost tracking.",
  skills: [
    { label: "Languages", value: "Python, SQL, TypeScript, Go" },
    { label: "Agentic", value: "MCP (client & server), tool-calling loops, LangGraph, LangChain, CrewAI" },
    { label: "LLM", value: "Azure OpenAI, Anthropic Claude, Google Gemini, NVIDIA NIM; prompt caching, structured outputs, RAG, vision" },
    { label: "Backend", value: "FastAPI, asyncio, Pydantic, gRPC, REST" },
    { label: "Data", value: "DuckDB, SQLite + sqlite-vec, ClickHouse, Redpanda, FAISS, pandas" },
    { label: "Platform", value: "Docker, Azure, Microsoft Graph, OpenTelemetry, Git, pytest" },
  ],
  experience: [
    {
      org: "Netision Technology LLP",
      role: "AI Engineer",
      where: "Noida · on-site",
      when: "May 2025 – present",
      groups: [
        {
          heading: "Agent runtime and tools",
          bullets: [
            "Wrote the agent loop that runs every AI query: tool schemas, capped iterations, result truncation, and a last tool-free call so the model has to answer in text.",
            "Set up a tag-based tool contract where tools declare what they do and what they need, so adding one takes no runtime changes.",
            "Removed an extra billed round on capped turns by offering file tools only when the prompt actually asks for a file.",
            "Added cooperative cancellation across the pipelines after finding that stopped queries were still writing their results.",
          ],
        },
        {
          heading: "Multi-provider model layer",
          bullets: [
            "Built a shared library and model registry: 17 models across 6 providers, picked per request instead of baked into the pipeline; 86 releases in three months.",
            "Got prompt caching working with ordered breakpoints, bringing repeat tool-loop rounds down to a fraction of the first round's cost.",
            "Tracked down a content-filter block that only showed up through the proxy, then confirmed the fix on live calls: blocked calls went from 3/12 to 0/12.",
          ],
        },
        {
          heading: "Token accounting",
          bullets: [
            "Built a per-user cost ledger that meters every paid call (chat, embeddings, vision, OCR, images) into SQLite with a ClickHouse mirror.",
            "Made missing usage and unpriced models record as such rather than as zero, so nothing free gets confused with something never measured.",
            "Read token counts straight from provider payloads so cached-input and reasoning tokens are not lost.",
          ],
        },
        {
          heading: "Documents and spreadsheets",
          bullets: [
            "Routed uploads on text density rather than file extension, so image-only decks go to vision transcription and text PDFs to the normal extractor.",
            "Swapped naive chunking of spreadsheets for SQL over detected tables with schema-card embeddings, then made table discovery progressive so it fits the tool-result cap. Graded accuracy went from 2/8 to 6/8.",
            "Sandboxed model-written SQL: no external access, read-only statements, scoped to the current conversation's tables.",
          ],
        },
        {
          heading: "Connectors, tools and security",
          bullets: [
            "Architected the MCP tool server: 49 tools, including 13 per-user connectors for Microsoft 365, Power BI, Google Workspace, Zoho and Databricks (the last two not yet run against a live account), passing delegated tokens as transport headers so the model can never set one.",
            "Designed host-side approval for outbound mail: the parked call is the card, and Send runs it with a fresh token and no model in the path. A teammate built the first version; I added replies, attachments and per-provider routing.",
            "Wrote most of 60+ test modules covering wire contracts, cancellation, metering and citations.",
          ],
        },
        {
          heading: "Earlier at Netision",
          bullets: [
            "Text-to-SQL analytics and root-cause agents over a read-only warehouse; cut a root-cause turn from 77.8 s to 12 s with the report unchanged.",
            "Backends for an on-prem observability platform in Go and FastAPI: agents, a collector, a probe, and a control plane on Redpanda and ClickHouse.",
          ],
        },
      ],
    },
    {
      org: "Coginetics",
      role: "AI Software Trainee",
      where: "Noida",
      when: "Dec 2024 – May 2025",
      groups: [{ heading: "", bullets: ["Built LLM agents with LangChain, CrewAI and the OpenAI API, where I moved from web development to agents."] }],
    },
    {
      org: "Tech Freedom Online",
      role: "Web Developer Intern",
      where: "Remote",
      when: "Jul 2024 – Dec 2024",
      groups: [{ heading: "", bullets: ["Front-end and back-end work on web applications."] }],
    },
  ],
  projects: [
    { name: "Intelligent web scraper with MCP", detail: "An MCP server that exposes web scraping to any MCP client, working out the site type through parallel async probing; a multi-strategy scraper built on Factory and Strategy patterns.", stack: "Python, Playwright, BeautifulSoup, MCP" },
    { name: "Multi-agent automation suite", detail: "25+ CrewAI agents with sequential processing, shared memory and delegation for lead generation, SEO and content workflows.", stack: "CrewAI, Gemini, LangChain, pandas" },
    { name: "SplitCash: voice-driven finance pipeline", detail: "Turns Hindi speech into translated, structured ledger entries, with 5 speech-to-text and 3 LLM providers behind one interface.", stack: "LangChain, DuckDB, Python" },
  ],
  education: [{ school: "Bennett University", degree: "BCA, Data Science", grade: "9.6/10", when: "2022 – 2025" }],
  certifications: [
    "Introduction to Model Context Protocol, Anthropic (2025)",
    "AI Fluency: Framework & Foundations, Anthropic (2025)",
    "Google Data Analytics Professional Certificate",
    "AWS Academy Graduate: Data Engineering, Cloud Architecting, Cloud Foundations",
  ],
};
