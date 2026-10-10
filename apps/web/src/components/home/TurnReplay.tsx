import { scenarios, turnPipeline } from "@jrk/content";
import { TraceReplay } from "@/components/TraceReplay";
import { SectionHead } from "./SectionHead";

export function TurnReplay({ n = "02" }: { n?: string }) {
  return (
    <section id="turn" className="shell py-16 md:py-24" aria-labelledby="turn-title">
      <SectionHead
        n={n}
        id="turn-title"
        title="Anatomy of a turn"
        kicker="fig. 2"
        lede="Pick a question and watch what the query backend I built does with it: which boxes it passes through, what each step decided, and why it was built that way."
      />
      <TraceReplay diagram={turnPipeline} scenarios={scenarios} chooseLabel="Choose a question to replay" />
    </section>
  );
}
