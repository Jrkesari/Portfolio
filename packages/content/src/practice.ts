// How I structure work — the repo shape I keep reaching for, annotated.

export const repoShape: { tree: string; note?: string }[] = [
  { tree: "repo/" },
  { tree: "├── CLAUDE.md", note: "a decision log: each rule, then the incident behind it" },
  { tree: "├── docs/plans/", note: "the plan comes first, then one commit per step" },
  { tree: "├── src/" },
  { tree: "│   ├── api/", note: "handlers orchestrate, and do nothing else" },
  { tree: "│   └── core/", note: "registries, not branches" },
  { tree: "├── tests/", note: "named as behaviours: “a stop during the final call does not publish”" },
  { tree: "└── .claude/skills/", note: "checklists for the coding agents I work with" },
];

export interface Practice {
  title: string;
  body: string;
  evidence: string;
}

export const practices: Practice[] = [
  {
    title: "Plan first, then one commit per step.",
    body: "A plan document written against the code, with file and line references, before anything changes. Big plans get adversarial reviews first. The connector plan had six. Then the plan is executed one step per commit, so the history reads like the plan.",
    evidence: "working with Claude Code, the observability control plane went through eight planned phases in one day",
  },
  {
    title: "A decision log next to the code.",
    body: "My project instructions aren't a style guide. Each paragraph is a rule in bold, then the incident or measurement that produced it, so the next person (or agent) knows which rules are load-bearing. Comments are one or two lines and say why, not what.",
    evidence: "about 700 lines of rules, each with its reason",
  },
  {
    title: "Agents get checklists, not vibes.",
    body: "I write skills for the coding agents I work with: a release gate in tiers, a root-cause routine that labels findings confirmed, probable or hypothesis, a token audit, a dependency audit. Each one ends the same way: merging is never the agent's call.",
    evidence: "seven project skills in the query backend",
  },
  {
    title: "Registries, not branches.",
    body: "Things that grow (models, tools, file readers, skills) register themselves, and the code asks the registry instead of keeping a list. Adding a model is a line of data; adding a tool is a folder.",
    evidence: "a file type was refused at the door while a working reader sat behind it, until the gate asked the registry",
  },
];
