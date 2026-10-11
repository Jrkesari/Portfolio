import { site } from "@jrk/content";
import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { NotesPreview } from "@/components/home/NotesPreview";
import { WorkIndex } from "@/components/home/WorkIndex";
import { person, Seo, website } from "@/components/Seo";

export const Route = createFileRoute("/")({
  component: Home,
});

// The home page is the short version: who, the work, the notes. One system taken
// apart and the numbers live on /work; the rules on /thinking; the path on /about.
function Home() {
  return (
    <main>
      <Seo
        title={`${site.name} · ${site.role}`}
        description={site.description}
        path="/"
        type="profile"
        kind="ProfilePage"
        graph={[website, person]}
      />
      <Hero />
      <WorkIndex more />
      <NotesPreview n="02" />
    </main>
  );
}
