import type { Rule } from "./types.ts";

// The working rules I keep coming back to. Each one is a rule plus the thing
// that happened to produce it — the same shape as the decision log I keep
// next to the code.

export const rules: Rule[] = [
  {
    id: "unmeasured",
    rule: "Unmeasured is not zero.",
    incident:
      "Chat spend was being logged against a user named after the service itself. Embeddings, OCR pages and generated images weren't metered at all, and one model was costed at a fifth of its invoice.",
    practice:
      "Numbers come only from the provider's own usage payload. A token is never estimated. A payload nobody could read is flagged `usage_missing`; a model with no rate is flagged `pricing_missing`; unpriced models are named at boot, before the first invoice.",
    result: "Free, unpriced and unmeasured are three states, and they look different on every report.",
    theme: "honesty",
    from: "llm-library",
  },
  {
    id: "authority",
    rule: "The model never holds authority.",
    incident:
      "Tool arguments are written by the model and re-sent in history. Anything that rides in them (a user id, a token, an API host) is something the model could set.",
    practice:
      "Identity, credentials, hosts, approvals and SQL scope are enforced by code and headers, not by sentences in a prompt. A model that could set its own model could pick anyone's.",
    result: "No tool takes a user, a token or a host, and a test fails if one ever does.",
    theme: "safety",
    from: "tool-server",
  },
  {
    id: "before-202",
    rule: "Fail at the door, degrade inside.",
    incident:
      "An async API that answers 202 and then fails in the background looks, to the person using it, like the agent breaking, not like a bad request.",
    practice:
      "Unknown model, unknown agent, empty prompt: refused synchronously, before anything is promised. Inside the turn, the opposite: a tool server that's down means answering without tools, not dying.",
    result: "Frontend renames that used to drop fields silently now fail loudly, on the first request.",
    theme: "structure",
    from: "query-backend",
  },
  {
    id: "two-defences",
    rule: "Two defences, each enough on its own.",
    incident:
      "The model writes SQL over uploaded spreadsheets, and the engine can read the filesystem: `read_csv('/etc/passwd')` is valid SQL.",
    practice:
      "A connection that is locked down before it's used, **and** a statement check: one read-only statement, only this conversation's tables, no file functions. Refusals are worded for the model, so it fixes the query next round.",
    result: "Either alone would probably hold. Neither alone is worth betting a filesystem on.",
    theme: "safety",
    from: "llm-library",
  },
  {
    id: "stop",
    rule: "A stop is not an error.",
    incident: "Pressing Stop logged a cancel, and the stopped query still wrote its result.",
    practice:
      "Cancellation is a `BaseException`, so it sails past the `except Exception` blocks that turn failures into error messages. The model proxy checks before every call. But a cached response skips that check, so each pipeline also checks right before anything reaches the user.",
    result: "Three rules, pinned by their own test file.",
    theme: "structure",
    from: "query-backend",
  },
  {
    id: "measure",
    rule: "Measure the lever. Keep the rejected numbers.",
    incident:
      "Batching every store family into one model call looked like an obvious saving: 56% less input. Measured, that step went from 5.8 s to 15.8 s: one long serial decode instead of four running at once.",
    practice:
      "Every lever gets measured on the real thing before it's trusted, and a rejected option is written down with its numbers next to the decision, so nobody re-runs the experiment by accident.",
    result: "The fan-out stayed. The turn got fast elsewhere (slow views stored as tables, the date range read once, lower effort on the two prose stages): 77.8 s → 12 s.",
    theme: "cost",
    from: "analytics-agents",
  },
  {
    id: "square",
    rule: "Cost grows with the square of the loop.",
    incident:
      "Every round of an agent loop re-sends every earlier round's results. A 500 KB PDF returned as base64 would cost about 170,000 tokens per turn.",
    practice:
      "A hard cap on rounds. Results truncated at one choke point, not per tool. Files by reference (~30 tokens). Tools offered only when this request can use them. Prefixes kept stable so the cache can do its job.",
    result: "Later rounds re-read the prefix from cache at about a tenth of the price.",
    theme: "cost",
    from: "query-backend",
  },
  {
    id: "position",
    rule: "Where a sentence sits in the prompt is architecture.",
    incident:
      "0 of 35 registered sources were cited in one logged turn. The instruction to cite was gated differently from the registration. And where it was sent, it sat above seven searches' worth of results.",
    practice:
      "The model writes its answer from the bottom of the message list up. So notes go directly under the results they're about, and standing instructions go after the history, because above it they lose.",
    result: "One predicate now decides both whether sources are registered and whether the note is sent, and the note sits directly under the results.",
    theme: "structure",
    from: "query-backend",
  },
  {
    id: "one-source",
    rule: "If two files must agree, one of them is a bug.",
    incident:
      "The model config lived in four repositories. One copy was about 2,500 lines away from another; a fix in one never reached the rest.",
    practice:
      "One library, published by tag. Registries that answer the question instead of lists that drift. Contract tests that read the TypeScript frontend from the Python backend, so the two can't disagree quietly.",
    result: "86 releases in three months; the two production services install it instead of keeping a copy.",
    theme: "structure",
    from: "llm-library",
  },
  {
    id: "root-cause",
    rule: "A root cause is something you can switch on and off.",
    incident:
      "A guardrail blocked some calls and not others, and only through the proxy. Fifty-five direct calls reproduced nothing. A payload assembled here is not the payload sent.",
    practice:
      "Until the symptom has been flipped in both directions, it's a hypothesis, and it gets labelled one: confirmed, probable or hypothesis, never “should work”.",
    result: "Three copies of one line: 3/12 blocked. One copy: 0/12.",
    theme: "debugging",
    from: "llm-library",
  },
  {
    id: "delete",
    rule: "Delete with evidence.",
    incident:
      "Diagnostic tables had grown without limits. One column of payloads was 71% of the database, for 735 distinct values across 1,571 rows; another table had never been written.",
    practice:
      "Measure first (anti-joins, blank rates, row-by-row comparisons), then drop. A column that reads 0 everywhere says “none happened”, when the truth was “not counted”. A module nobody could call was speculation, so it goes.",
    result: "One rule for retention anyone can state, and one owner for every fact.",
    theme: "honesty",
    from: "llm-library",
  },
  {
    id: "tests",
    rule: "A test name is a specification.",
    incident:
      "Two halves of a document reader each passed their tests for months, while a whole class of decks was refused. Each half was right alone.",
    practice:
      "Tests are named as behaviours: `a stop during the final call does not publish`, `an unpriced model is flagged, not free`. Paired failures get paired tests. Snapshots get replaced by properties: a recording only says “unchanged since someone recorded it”.",
    result: "The suite reads like the rules it enforces.",
    theme: "debugging",
    from: "query-backend",
  },
];

export const ruleThemes: Record<Rule["theme"], string> = {
  honesty: "honest numbers",
  safety: "safety",
  cost: "cost",
  structure: "structure",
  debugging: "debugging",
};
