import { createFileRoute } from "@tanstack/react-router";
import { HowIWork } from "@/components/home/HowIWork";
import { RulesLog } from "@/components/home/RulesLog";
import { PageHead } from "@/components/PageHead";
import { Seo } from "@/components/Seo";

export const Route = createFileRoute("/thinking")({
  component: Thinking,
});

function Thinking() {
  return (
    <main className="pt-32 md:pt-40">
      <Seo
        title="How I think · Jayesh Ranjan Kesari"
        description="Rules I work by, each with the incident that produced it, and the shape I keep reaching for when I start a repository."
        path="/thinking"
        crumbs={[{ name: "How I think", path: "/thinking" }]}
      />
      <div className="shell">
        <PageHead
          label="thinking"
          title="How I think"
          lede="Rules I work by, each with the incident that produced it, and the shape I keep reaching for when I start a repository."
        />
      </div>
      <RulesLog n="01" />
      <HowIWork n="02" />
    </main>
  );
}
