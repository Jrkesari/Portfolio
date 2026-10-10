import type { Diagram } from "./diagrams.ts";

// Case-study figures. Captions are the story; the boxes are the structure.

export const llmCallFigure: Diagram = {
  id: "llm-call",
  label: "Diagram of one model call: a model key goes to a registry configured by models.yaml, through a provider translator, through a proxy that also writes to a cost ledger, and finally to the provider.",
  src: String.raw`
┌─────────────┐
│  model key  │
└──────┬──────┘
       ▼
┌─────────────┐      ┌─────────────┐
│  registry   │◀─────│ models.yaml │
└──────┬──────┘      └─────────────┘
       ▼
┌─────────────┐
│ translator  │
└──────┬──────┘
       ▼
┌─────────────┐      ┌─────────────┐
│    proxy    │┄┄┄┄┄▶│   ledger    │
└──────┬──────┘      └─────────────┘
       ▼
┌─────────────┐
│  provider   │
└─────────────┘`,
  steps: [
    {
      caption: "The frontend sends a model key with the question. It is set once, at the request boundary. So no function in between grows a model argument it only forwards.",
      nodes: ["model-key"],
      edges: [["model-key", "registry"]],
    },
    {
      caption: "One client per key, built once. Each model's quirks live beside its entry in one file. And an entry that stops answering is deleted, not commented out.",
      nodes: ["registry", "models-yaml"],
      edges: [["models-yaml", "registry"]],
    },
    {
      caption: "Every app speaks one OpenAI-shaped interface. Anthropic and Gemini get translators; the OpenAI-wire providers share a single wrapper.",
      nodes: ["translator"],
      edges: [["registry", "translator"]],
    },
    {
      caption: "Every call passes one proxy: a Stop checkpoint, one confidentiality line, and usage read from the provider's own payload, straight into the ledger.",
      nodes: ["proxy", "ledger"],
      edges: [
        ["translator", "proxy"],
        ["proxy", "ledger"],
      ],
    },
    {
      caption: "Only then, the provider. Swapping models is a key change, not a code change.",
      nodes: ["provider"],
      edges: [["proxy", "provider"]],
    },
  ],
};

export const toolServerFigure: Diagram = {
  id: "tool-server",
  label: "Diagram of the MCP tool server: an agent host sends requests with identity in headers, through middleware, to a registry that exposes 49 first-party tools calling SaaS APIs, and mounts external MCP servers as proxies.",
  aliases: { "49 tools": "tools" },
  src: String.raw`
┌──────────────┐
│  agent host  │
└──────┬───────┘
       │ headers, never arguments
       ▼
┌──────────────┐
│  middleware  │
└──────┬───────┘
       ▼
┌──────────────┐      ┌──────────────┐
│   registry   │─────▶│  49 tools    │
└──────┬───────┘      └──────┬───────┘
       │                     ▼
       │              ┌──────────────┐
       │              │  SaaS APIs   │
       ▼              └──────────────┘
┌──────────────┐
│ MCP proxies  │
└──────────────┘`,
  steps: [
    {
      caption: "Who is asking, their delegated token, the model and the turn all ride headers into context variables. A model that could set them as arguments could read someone else's account.",
      nodes: ["agent-host"],
      edges: [["agent-host", "middleware"]],
    },
    {
      caption: "Audit outermost, so even refusals are recorded; then one service check; then context. User auth stays the caller's job. This server executes tools, it doesn't run conversations.",
      nodes: ["middleware"],
      edges: [["middleware", "registry"]],
    },
    {
      caption: "Drop a folder, get a module. Each tool declares what it is (produces_file, requires_approval, connector:outlook), so hosts read behaviour from tags instead of hard-coding it.",
      nodes: ["registry", "tools"],
      edges: [["registry", "tools"]],
    },
    {
      caption: "Results are sized for the caller's context, and files travel by reference (about 30 tokens), never as bytes, which would be ~170,000 per turn for a 500 KB PDF.",
      nodes: ["tools", "saas-apis"],
      edges: [["tools", "saas-apis"]],
    },
    {
      caption: "External MCP servers mount behind the same front door, with the user's token stripped before anything is forwarded to them.",
      nodes: ["mcp-proxies"],
      edges: [["registry", "mcp-proxies"]],
    },
  ],
};

export const telemetryFigure: Diagram = {
  id: "telemetry",
  label: "Diagram of the observability platform: three agents send telemetry over gRPC with mTLS to one collector, which is the only thing that sends data out over HTTPS to an ingest API, then Redpanda, then ClickHouse.",
  src: String.raw`
┌─────────┐  ┌─────────┐  ┌─────────┐
│ agent 1 │  │ agent 2 │  │ agent 3 │
└────┬────┘  └────┬────┘  └────┬────┘
     │            │            │
     └────────────┼────────────┘
                  ▼  gRPC · mTLS
           ┌─────────────┐
           │  collector  │
           └──────┬──────┘
                  ▼  HTTPS :443, outbound only
           ┌─────────────┐
           │   ingest    │
           └──────┬──────┘
                  ▼
           ┌─────────────┐
           │  Redpanda   │
           └──────┬──────┘
                  ▼
           ┌─────────────┐
           │ ClickHouse  │
           └─────────────┘`,
  steps: [
    {
      caption: "One static Go binary per machine. Modules (host metrics, logs, SNMP, ICMP) post to an in-process bus, and a single forwarder drains it in batches.",
      nodes: ["agent-1", "agent-2", "agent-3"],
      edges: [],
    },
    {
      caption: "Agents talk gRPC with mutual TLS to a collector inside the customer's own network. They never touch the internet.",
      nodes: ["collector"],
      edges: [
        ["agent-1", "collector"],
        ["agent-2", "collector"],
        ["agent-3", "collector"],
      ],
    },
    {
      caption: "The collector is the single way out: outbound :443 only. The cloud never connects in; the collector polls for config. A firewall admin opens one rule for one machine.",
      nodes: ["collector", "ingest"],
      edges: [["collector", "ingest"]],
    },
    {
      caption: "The API produces to Redpanda; ClickHouse pulls through Kafka-engine tables and materialised views. Reads go through a read-only user with per-tenant budgets.",
      nodes: ["redpanda", "clickhouse"],
      edges: [
        ["ingest", "redpanda"],
        ["redpanda", "clickhouse"],
      ],
    },
  ],
};

export const rcaFigure: Diagram = {
  id: "rca",
  label: "Diagram of the root-cause agent: load context, compute, then fan out to one model call per family of stores in parallel, then render one report.",
  src: String.raw`
       ┌──────────────┐
       │ load context │
       └──────┬───────┘
              ▼
       ┌──────────────┐
       │   compute    │
       └──────┬───────┘
  ┌───────────┼───────────┐
  ▼           ▼           ▼
┌──────────┐┌──────────┐┌──────────┐
│ family 1 ││ family 2 ││ family 3 │
└────┬─────┘└────┬─────┘└────┬─────┘
     └───────────┼───────────┘
                 ▼
       ┌──────────────┐
       │    render    │
       └──────────────┘`,
  steps: [
    {
      caption: "Context first: what was asked, which stores, which period. Only this step decides anything; everything after it is a writing task.",
      nodes: ["load-context"],
      edges: [["load-context", "compute"]],
    },
    {
      caption: "The numbers are computed in SQL, not by the model. Stores are bucketed into families on a grid.",
      nodes: ["compute"],
      edges: [],
    },
    {
      caption: "One call per family (a fan-out, not a gather), so each retries alone and a concurrency cap bounds the spend. Batching them into one call was measured and rejected: 56% less input, almost three times slower.",
      nodes: ["family-1", "family-2", "family-3"],
      edges: [
        ["compute", "family-1"],
        ["compute", "family-2"],
        ["compute", "family-3"],
      ],
    },
    {
      caption: "One report. The whole turn went from 77.8 s to 12 s, with the report unchanged.",
      nodes: ["render"],
      edges: [
        ["family-1", "render"],
        ["family-2", "render"],
        ["family-3", "render"],
      ],
    },
  ],
};

export const localAgentFigure: Diagram = {
  id: "local-agent",
  label: "Diagram of the desktop agent: the cloud UI talks to a bridge over a WebSocket, the bridge talks to an agent on the user's machine, and any change to files goes through a confirm step first.",
  src: String.raw`
┌──────────┐      ┌──────────┐      ┌───────────┐
│ cloud UI │─────▶│  bridge  │─────▶│   agent   │
│          │◀─────│          │◀─────│           │
└──────────┘      └──────────┘      └─────┬─────┘
                                          ▼
                                    ┌───────────┐
                                    │  confirm  │
                                    └─────┬─────┘
                                          ▼
                                    ┌───────────┐
                                    │   files   │
                                    └───────────┘`,
  steps: [
    {
      caption: "The design: you ask in the web app you already use, and the request crosses a WebSocket bridge to an agent that the machine dialled out to. Nothing listens on the laptop.",
      nodes: ["cloud-ui", "bridge", "agent"],
      edges: [
        ["cloud-ui", "bridge"],
        ["bridge", "agent"],
      ],
    },
    {
      caption: "Reads run at once: list a folder, find a file, summarise a document.",
      nodes: ["agent"],
      edges: [
        ["agent", "bridge"],
        ["bridge", "cloud-ui"],
      ],
    },
    {
      caption: "Anything that writes, moves or deletes is held as a plan for the UI to show, and waits. Nothing destructive runs without an explicit yes.",
      nodes: ["confirm"],
      edges: [["agent", "confirm"]],
    },
    {
      caption: "Then, and only then, the real files.",
      nodes: ["files"],
      edges: [["confirm", "files"]],
    },
  ],
};

export const figures = { llmCallFigure, toolServerFigure, telemetryFigure, rcaFigure, localAgentFigure };
