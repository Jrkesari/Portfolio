// Vercel serverless function — backend for the "Prompt Golf" game.
//
// The player writes a prompt; we run it through NVIDIA's OpenAI-compatible
// API (Ministral-14B) and check whether the model's reply hits the round's
// target. The API key lives ONLY here (server-side) — it never ships to the
// browser.
//
// This endpoint is PUBLIC, so it's hardened against abuse:
//   1. Origin allowlist  — only our own site may call it.
//   2. Per-IP rate limit  — sliding window, 12/min and 80/hour.
//   3. Global rate limit  — circuit breaker across all callers, caps total
//                           spend even under a distributed flood.
//   4. Input caps         — prompt length + tight max_tokens keep each call cheap.
//   5. Quiet errors       — never leak upstream detail to the client.
//
// Note: the in-memory counters live per serverless instance and reset on cold
// start. They are a strong speed bump, not a distributed quota. For a hard
// guarantee, also set a monthly spend cap on the NVIDIA key itself.

export const config = { runtime: "nodejs" };

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || "https://integrate.api.nvidia.com/v1";
const NVIDIA_MODEL = "mistralai/ministral-14b-instruct-2512";

const MAX_TOKENS = 150;
const MAX_PROMPT_CHARS = 600;

// Per-IP limits (sliding window).
const PER_IP_PER_MIN = 12;
const PER_IP_PER_HOUR = 80;
// Global circuit breaker — total calls/min across everyone.
const GLOBAL_PER_MIN = 120;

// Hosts allowed to call this endpoint. Vercel injects the deploy URL; we also
// allow the production domain and localhost for `vercel dev`. Extra origins can
// be added via ALLOWED_ORIGINS (comma-separated) without a code change.
function allowedHosts(): string[] {
  const hosts = ["localhost", "127.0.0.1"];
  if (process.env.VERCEL_URL) hosts.push(process.env.VERCEL_URL);
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) hosts.push(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  const extra = process.env.ALLOWED_ORIGINS;
  if (extra) hosts.push(...extra.split(",").map((s) => s.trim()).filter(Boolean));
  return hosts;
}

function originAllowed(req: any): boolean {
  const src = req.headers["origin"] || req.headers["referer"] || "";
  if (!src) return false; // same-origin browser fetch always sends one of these
  let host: string;
  try {
    host = new URL(src).hostname;
  } catch {
    return false;
  }
  return allowedHosts().some((h) => host === h || host.endsWith(`.${h}`) || h.endsWith(host));
}

const SYSTEM_PROMPT =
  "You are a terminal. Execute the user's instruction literally and output " +
  "ONLY the requested result — no preamble, no explanation, no surrounding " +
  "quotes, no markdown fences. If the instruction is unclear, output nothing.";

type Matcher = (out: string) => boolean;

const norm = (s: string) =>
  s.trim().toLowerCase().replace(/^["'`]+|["'`]+$/g, "").replace(/\s+/g, " ");

const ROUND_MATCHERS: Record<string, Matcher> = {
  "exact-phrase": (out) => norm(out) === "the eagle has landed",
  "single-emoji": (out) => out.trim() === "🍍",
  "haiku-rain": (out) => {
    const lines = out.trim().split("\n").filter((l) => l.trim().length > 0);
    return lines.length === 3;
  },
};

// --- Rate limiting (sliding-window timestamps, in-memory) --------------------
const hitsByIp = new Map<string, number[]>();
const globalHits: number[] = [];
const HOUR = 60 * 60 * 1000;
const MIN = 60 * 1000;

function prune(arr: number[], windowMs: number, now: number): number[] {
  const cutoff = now - windowMs;
  let i = 0;
  while (i < arr.length && arr[i] < cutoff) i++;
  return i > 0 ? arr.slice(i) : arr;
}

/** Returns null if allowed, or a wait-suggestion string if limited. */
function checkLimits(ip: string, now: number): string | null {
  // Global breaker first.
  const g = prune(globalHits, MIN, now);
  globalHits.length = 0;
  globalHits.push(...g);
  if (globalHits.length >= GLOBAL_PER_MIN) return "Busy right now — try again in a minute.";

  const arr = prune(hitsByIp.get(ip) ?? [], HOUR, now);
  const inLastMin = arr.filter((t) => t >= now - MIN).length;
  if (inLastMin >= PER_IP_PER_MIN) return "Slow down a sec — too many swings this minute.";
  if (arr.length >= PER_IP_PER_HOUR) return "You've hit the hourly limit — come back later.";

  arr.push(now);
  hitsByIp.set(ip, arr);
  globalHits.push(now);
  return null;
}

function clientIp(req: any): string {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket?.remoteAddress || "unknown";
}

function countWords(s: string): number {
  const t = s.trim();
  return t.length === 0 ? 0 : t.split(/\s+/).length;
}

export default async function handler(req: any, res: any) {
  // Never cache a dynamic, rate-limited endpoint.
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!originAllowed(req)) {
    res.status(403).json({ error: "Forbidden." });
    return;
  }

  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server misconfigured." });
    return;
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const prompt: string = (body.prompt ?? "").toString();
  const roundId: string = (body.roundId ?? "").toString();

  const matcher = ROUND_MATCHERS[roundId];
  if (!matcher) {
    res.status(400).json({ error: "Unknown round." });
    return;
  }
  if (!prompt.trim()) {
    res.status(400).json({ error: "Write a prompt first." });
    return;
  }
  if (prompt.length > MAX_PROMPT_CHARS) {
    res.status(400).json({ error: `Keep it under ${MAX_PROMPT_CHARS} characters.` });
    return;
  }

  const now = Date.now();
  const limited = checkLimits(clientIp(req), now);
  if (limited) {
    res.status(429).json({ error: limited });
    return;
  }

  const startedAt = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000); // cap upstream wait

    const upstream = await fetch(`${NVIDIA_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: MAX_TOKENS,
        stream: false,
      }),
    }).finally(() => clearTimeout(timeout));

    if (!upstream.ok) {
      // Log full detail server-side; return nothing useful to the client.
      console.error("[prompt-golf] upstream", upstream.status, (await upstream.text()).slice(0, 500));
      res.status(502).json({ error: "Model call failed. Try again." });
      return;
    }

    const data = await upstream.json();
    const output: string = data?.choices?.[0]?.message?.content ?? "";

    res.status(200).json({
      output,
      matched: matcher(output),
      words: countWords(prompt),
      latencyMs: Date.now() - startedAt,
      model: NVIDIA_MODEL,
    });
  } catch (err: any) {
    console.error("[prompt-golf] error", String(err).slice(0, 300));
    res.status(500).json({ error: "Something went wrong. Try again." });
  }
}

function safeParse(s: string) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
