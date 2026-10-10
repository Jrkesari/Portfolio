import { site } from "@jrk/content";

export { site };

/** "01:12" in Noida, plus a rough guess at what I'm doing. */
export function noidaTime(now: Date) {
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: site.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: site.timeZone, hour: "2-digit", hour12: false }).format(now),
  );
  const awake = hour >= 8 && hour < 24;
  const status =
    hour < 7
      ? "probably asleep"
      : hour < 10
        ? "probably just up"
        : hour < 19
          ? "probably inside an agent loop"
          : "probably still shipping";
  return { time, hour, awake, status };
}

/** How far ahead (or behind) Noida is from the visitor, e.g. "9h 30m ahead of you". */
export function offsetFromVisitor(now: Date) {
  try {
    const visitorTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (!visitorTz || visitorTz === site.timeZone || visitorTz === "Asia/Calcutta") return "same time as you";
    const toMinutes = (tz: string) => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).formatToParts(now);
      const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
      return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour") % 24, get("minute")) / 60000;
    };
    const diff = toMinutes(site.timeZone) - toMinutes(visitorTz);
    if (diff === 0) return "same time as you";
    const abs = Math.abs(diff);
    const h = Math.floor(abs / 60);
    const m = abs % 60;
    const span = `${h ? `${h}h` : ""}${h && m ? " " : ""}${m ? `${m}m` : ""}`;
    return `${span} ${diff > 0 ? "ahead of" : "behind"} you`;
  } catch {
    return "";
  }
}
