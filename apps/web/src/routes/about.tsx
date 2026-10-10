import { createFileRoute } from "@tanstack/react-router";
import { Earlier } from "@/components/home/Earlier";
import { PathLog } from "@/components/home/PathLog";
import { Toolbox } from "@/components/home/Toolbox";
import { PageHead } from "@/components/PageHead";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <main className="pt-32 md:pt-40">
      <title>About · Jayesh Ranjan Kesari</title>
      <meta
        name="description"
        content="How I got here, what I reach for, and the smaller things I built before the day job."
      />
      <div className="shell">
        <PageHead
          label="about"
          title="About"
          lede="How I got here, what I'd pick up tomorrow without looking anything up, and the smaller things I built before the day job."
        />
      </div>
      <PathLog n="01" />
      <Toolbox n="02" />
      <Earlier n="03" />
    </main>
  );
}
