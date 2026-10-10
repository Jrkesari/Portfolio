import type { ReactNode } from "react";

interface Props {
  n: string;
  id?: string;
  title: ReactNode;
  kicker?: string;
  lede?: ReactNode;
  className?: string;
}

/** Section opener: a running number, a rule that draws in, a serif title. */
export function SectionHead({ n, id, title, kicker, lede, className = "" }: Props) {
  return (
    <header className={`reveal ${className}`}>
      <div className="mono mb-7 flex items-center gap-3 text-[12px] text-graphite">
        <span className="tabular-nums text-neel">§ {n}</span>
        <span aria-hidden className="rule-draw h-px w-16 bg-rule" />
        {kicker && <span>{kicker}</span>}
      </div>
      <h2
        id={id}
        className="max-w-[18ch] font-serif text-[clamp(2.3rem,5vw,3.6rem)] leading-[1] font-light tracking-[-0.035em]"
      >
        {title}
      </h2>
      {lede && <p className="mt-6 max-w-[38rem] text-[1.08rem] text-ink-2">{lede}</p>}
    </header>
  );
}
