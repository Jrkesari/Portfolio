import { useEffect, useState } from "react";
import { noidaTime, offsetFromVisitor } from "@/lib/time";

/** Live time in Noida. `verbose` adds the guess and the offset from the visitor. */
export function Clock({ verbose = false, className = "" }: { verbose?: boolean; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);
  if (!now) return <span className={className}>&nbsp;</span>;
  const { time, awake, status } = noidaTime(now);
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} title={`${status} · ${offsetFromVisitor(now)}`}>
      <span
        aria-hidden
        className={`inline-block size-[7px] rounded-full ${awake ? "bg-kesari motion-safe:animate-[breathe_3.2s_ease-in-out_1]" : "border border-graphite"}`}
      />
      <span className="tabular-nums">
        {time} <span className="text-graphite">IST</span>
      </span>
      {verbose && (
        <span className="text-graphite">
          · {status}, {offsetFromVisitor(now)}.
        </span>
      )}
    </span>
  );
}
