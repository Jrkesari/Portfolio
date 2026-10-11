import { createFileRoute } from "@tanstack/react-router";
import { Receipt } from "@/components/home/Receipt";
import { TurnReplay } from "@/components/home/TurnReplay";
import { WorkIndex } from "@/components/home/WorkIndex";
import { PageHead } from "@/components/PageHead";
import { Seo } from "@/components/Seo";

export const Route = createFileRoute("/work/")({
  component: Work,
});

function Work() {
  return (
    <main className="pt-32 md:pt-40">
      <Seo
        title="Work · Jayesh Ranjan Kesari"
        description="The systems I built, one of them taken apart step by step, and what they added up to, with a source for every number."
        path="/work"
        crumbs={[{ name: "Work", path: "/work" }]}
      />
      <div className="shell">
        <PageHead
          label="work"
          title="Work"
          lede="The systems I built, one of them taken apart step by step, and what they added up to, with a source for every number."
        />
      </div>
      <WorkIndex n="01" />
      <TurnReplay n="02" />
      <Receipt n="03" />
    </main>
  );
}
