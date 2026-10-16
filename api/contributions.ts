// Vercel serverless function — GitHub contributions per year, kept fresh.
//
// scripts/contributions.ts snapshots the same numbers at build time, but the site
// only rebuilds when this repo is pushed, so commits elsewhere never showed up.
// This serves them live instead, cached on Vercel's CDN for an hour, so GitHub's
// calendar is asked at most about once an hour per region and visitors' browsers
// still only ever talk to this site. If it fails, the page falls back to the
// build-time snapshot at /contributions.json.

export const config = { runtime: "nodejs" };

const SOURCE = "https://github-contributions-api.jogruber.de/v4/Jrkesari?y=all";
const FIRST_YEAR = 2022;

export default async function handler(req: any, res: any) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Cache-Control", "no-store");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const upstream = await fetch(SOURCE, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) throw new Error(`HTTP ${upstream.status}`);
    const data = (await upstream.json()) as { total?: Record<string, number> };
    const totals = Object.fromEntries(Object.entries(data.total ?? {}).filter(([y]) => Number(y) >= FIRST_YEAR));
    // Browsers always ask again (max-age=0); the CDN keeps it an hour, then serves
    // the old copy for up to a day while it fetches a new one in the background.
    res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ fetchedAt: new Date().toISOString(), totals });
  } catch {
    // Don't cache a failure; the page has its own fallback.
    res.setHeader("Cache-Control", "no-store");
    res.status(502).json({ error: "Contributions unavailable." });
  }
}
