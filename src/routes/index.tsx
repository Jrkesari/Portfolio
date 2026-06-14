import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { PromptGolf } from "@/components/sections/PromptGolf";
import { GitHubStats } from "@/components/sections/GitHubStats";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main>
      <Hero />
      <PromptGolf />
      <GitHubStats />
      <Projects />
      <Experience />
      <Skills />
      <Contact />
    </main>
  );
}
