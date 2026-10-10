// GitHub contributions per year, from the public calendar — fetched at build time
// so visitors' browsers never call a third party. This is the build's only network
// call, so it lives outside the cached tasks: turbo runs it after every build
// (see turbo.json) and it writes into dist/ as well as public/.
// If the API is down, whatever was there stays — or the page uses its own fallback.
import { existsSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const at = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));

try {
  const res = await fetch("https://github-contributions-api.jogruber.de/v4/Jrkesari?y=all", {
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as { total?: Record<string, number> };
  const totals = Object.fromEntries(Object.entries(data.total ?? {}).filter(([y]) => Number(y) >= 2022));
  const body = JSON.stringify({ fetchedAt: new Date().toISOString(), totals }, null, 2);
  writeFileSync(at("public/contributions.json"), body, "utf8");
  if (existsSync(at("dist"))) writeFileSync(at("dist/contributions.json"), body, "utf8");
  console.log("contributions.json written:", JSON.stringify(totals));
} catch (err) {
  console.warn("contributions.json not refreshed:", (err as Error).message);
}
