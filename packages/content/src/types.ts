import type { Diagram } from "./diagrams.ts";
import type { Scenario } from "./replay.ts";

/** Where a number came from. Every number on this site carries one. */
export type Provenance = "measured" | "eval" | "count" | "commit" | "doc";

export interface Metric {
  label: string;
  before?: string;
  after: string;
  /** Provenance tag, shown next to the number. */
  source: Provenance;
  note?: string;
}

/** A case-study section. Paragraph strings support the tiny inline syntax in lib/inline. */
export interface CaseSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Optional "ruled out" style list: option → why not. */
  rejected?: { option: string; why: string }[];
}

export interface System {
  slug: string;
  name: string;
  /** e.g. "Netision · 2026" */
  where: string;
  year: string;
  /** Honest attribution, one line. */
  role: string;
  oneLiner: string;
  summary: string;
  stack: string[];
  metrics: Metric[];
  diagram?: Diagram;
  /** An interactive replay shown on the case study, if there is one. */
  replay?: { title: string; lede: string; noun: string; choose: string; diagram: Diagram; scenarios: Scenario[] };
  sections: CaseSection[];
  links?: { label: string; href: string }[];
  /** Employer work: architecture only, no source links. */
  private?: boolean;
}

export interface Rule {
  id: string;
  /** The one-line rule, in bold on the page. */
  rule: string;
  /** What happened that produced it. */
  incident: string;
  /** What I do now because of it. */
  practice: string;
  /** Optional measured outcome. */
  result?: string;
  theme: "honesty" | "safety" | "cost" | "structure" | "debugging";
  /** Which system it came from. */
  from?: string;
}

export interface NoteMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  minutes: number;
  tags: string[];
}

export interface PathEntry {
  hash: string;
  date: string;
  branch: string;
  title: string;
  detail?: string;
  kind: "commit" | "merge" | "branch" | "tag";
}
