import type { ReactNode } from "react";

export function PageHead({ label, title, lede }: { label: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <header className="max-w-[46rem]">
      <p className="label">{label}</p>
      <h1 className="mt-5 font-serif text-[clamp(2.6rem,7vw,5rem)] leading-[0.95] font-light tracking-[-0.04em]">
        {title}
      </h1>
      {lede && <p className="mt-6 text-[1.12rem] text-ink-2">{lede}</p>}
    </header>
  );
}
