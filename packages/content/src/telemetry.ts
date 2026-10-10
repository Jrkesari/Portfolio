import type { Edge } from "./diagrams.ts";
import type { Scenario } from "./replay.ts";

// The observability pipeline, replayed for three moments. Intervals, retries and
// caps are the configured ones; timings on the bars are illustrative.

const fanIn: Edge[] = [
  ["agent-1", "collector"],
  ["agent-2", "collector"],
  ["agent-3", "collector"],
];
const agents = ["agent-1", "agent-2", "agent-3"];

export const telemetryScenarios: Scenario[] = [
  {
    id: "push",
    chip: "an ordinary push",
    ask: "Every 10 seconds: host metrics from three machines reach the cloud.",
    moral: "Inside the network, everything talks to the collector. Out of it, only the collector talks, and only outward.",
    spans: [
      { name: "modules", detail: "host metrics · 15 s", at: 0, ms: 300, nodes: agents, edges: [], why: "CPU, memory, disk, network and processes come from the OpenTelemetry Collector library, running inside the agent. From the outside there's no 'OTel-based or not'. Every source is just a module." },
      { name: "forwarder", detail: "1,000 per batch · gRPC", at: 300, ms: 900, nodes: agents, edges: fanIn, why: "Bus to disk log to gRPC. The forwarder is the only package allowed near the network. Modules can't even import it, so a module can't phone home by accident." },
      { name: "collector", detail: "mTLS · written first", at: 1200, ms: 400, nodes: ["collector"], edges: [], why: "TLS 1.3 with certificates both ways. Each item is tagged with the agent it came from and written to BadgerDB before anything else happens to it." },
      { name: "uplink", detail: "HTTPS :443", at: 1600, ms: 700, nodes: ["collector", "ingest"], edges: [["collector", "ingest"]], why: "One outbound queue, one worker. It's the only code path out of the datacenter, and the code is shaped so there can't be another." },
      { name: "storage", detail: "Redpanda → ClickHouse", at: 2300, ms: 900, nodes: ["redpanda", "clickhouse"], edges: [["ingest", "redpanda"], ["redpanda", "clickhouse"]], why: "The API produces to Redpanda; ClickHouse pulls from it through Kafka-engine tables and materialised views." },
    ],
  },
  {
    id: "outage",
    chip: "the uplink drops",
    ask: "The internet link from the datacenter goes down.",
    moral: "Nothing on disk is lost. But today a batch that outlives its retries waits for a restart. That gap is written down, and it's the next fix.",
    spans: [
      { name: "agents", detail: "unaffected", at: 0, ms: 600, nodes: agents, edges: fanIn, why: "Nothing inside the network notices. Agents only ever talk to the collector." },
      { name: "uplink", detail: "5xx · retrying", at: 600, ms: 1500, nodes: ["collector"], edges: [], tone: "warn", why: "Server errors, 429s and network failures retry with backoff from 500 ms up to 30 s, plus jitter, so a backend coming back isn't stampeded. A 4xx that isn't a 429 isn't retried; it's a bug, not weather." },
      { name: "WAL", detail: "filling, unacked", at: 2100, ms: 1800, nodes: ["collector"], edges: fanIn, tone: "warn", why: "Batches stay in the write-ahead log until the cloud acknowledges them. At the size cap (4 GB by default), new items are dropped with a warning, never silently." },
      { name: "retries spent", detail: "kept on disk", at: 3900, ms: 600, nodes: ["collector"], edges: [], tone: "stop", why: "After five attempts a batch stops being retried, but it isn't deleted. It stays in the log, unacknowledged. Today it's sent again when the collector restarts and replays the log. Re-sending on reconnect is the next fix." },
      { name: "back", detail: "new batches flow", at: 4500, ms: 900, nodes: ["collector", "ingest", "redpanda", "clickhouse"], edges: [["collector", "ingest"], ["ingest", "redpanda"], ["redpanda", "clickhouse"]], why: "When the link returns, new batches go out and each acknowledged batch deletes exactly the keys it sent. The stranded ones are the ones to watch until the replay-on-reconnect lands." },
    ],
  },
  {
    id: "config",
    chip: "a config change",
    ask: "Someone turns on log collection for one machine from the cloud console.",
    moral: "Config arrives because something asked for it. Nothing ever reaches into the network.",
    spans: [
      { name: "control", detail: "poll every 30 s", at: 0, ms: 300, nodes: ["collector", "ingest"], edges: [["collector", "ingest"]], why: "The cloud can't push. The collector asks every 30 seconds: anything newer than version N? Usually the answer is a 304." },
      { name: "distributor", detail: "queued for one agent", at: 300, ms: 200, nodes: ["collector"], edges: [], why: "Updates queue per agent (or for the whole site) in a store that's written through to disk, so a restart doesn't lose a pending change." },
      { name: "agent poll", detail: "pure pull", at: 500, ms: 600, nodes: ["agent-2", "collector"], edges: [["agent-2", "collector"]], why: "The agent asks its collector the same question. The collector never opens a connection to an agent." },
      { name: "reconcile", detail: "hot reload", at: 1100, ms: 400, nodes: ["agent-2"], edges: [], why: "Enable starts the module, update hot-reloads it (falling back to a restart), and every outcome goes onto the bus as an event. So config changes show up in the same telemetry they control." },
    ],
  },
];
