// Every diagram on the site is plain text — the same box-drawing I use in
// READMEs. `src/lib/ascii.ts` finds the boxes and traces the lines so a step
// can light a path and send a packet down it.

export type Edge = [from: string, to: string];

export interface DiagramStep {
  /** Short caption shown under the figure while this step plays. */
  caption: string;
  nodes: string[];
  edges: Edge[];
  /** Handwritten margin notes, positioned on the character grid. */
  notes?: { r: number; c: number; text: string }[];
}

export interface Diagram {
  id: string;
  label: string;
  src: string;
  /** Box label → id, for labels that don't slug nicely. */
  aliases?: Record<string, string>;
  steps: DiagramStep[];
}

/** fig. 1 — the hero. A turn, roughly. */
export const turnLoop: Diagram = {
  id: "turn-loop",
  label:
    "Diagram: a question goes into an agent loop, which calls tools on an MCP server, gets results back, and finally answers. Every tool call is also written to a cost ledger.",
  src: String.raw`
┌──────────┐   ┌────────────┐   ┌────────┐
│ question │──▶│ agent loop │──▶│ answer │
└──────────┘   └──┬──────┬──┘   └────────┘
                  │      ▲
           tools  ▼      │  results
               ┌─────────┴──┐    ┌────────┐
               │ MCP server │┄┄┄▶│ ledger │
               └────────────┘    └────────┘`,
  steps: [
    {
      caption: "A question comes in. It is checked before anything is promised. A bad request fails now, not as a broken answer later.",
      nodes: ["question"],
      edges: [["question", "agent-loop"]],
    },
    {
      caption: "The loop offers the model only the tools this request may use. What a tool does is read from its tags; which tools are offered at all is a short allowlist, kept small on purpose.",
      nodes: ["agent-loop"],
      edges: [["agent-loop", "mcp-server"]],
      notes: [{ r: 3, c: 28, text: "round 1 of 4" }],
    },
    {
      caption: "Results come back cut to one size at one choke point, and every paid call lands in the ledger. Unmeasured is not zero.",
      nodes: ["mcp-server", "ledger"],
      edges: [
        ["mcp-server", "agent-loop"],
        ["mcp-server", "ledger"],
      ],
    },
    {
      caption: "After at most four rounds, one last call with no tools at all, so the model has to answer in words.",
      nodes: ["agent-loop", "answer"],
      edges: [["agent-loop", "answer"]],
      notes: [{ r: 3, c: 28, text: "tool-free" }],
    },
  ],
};

export const diagrams = { turnLoop };
