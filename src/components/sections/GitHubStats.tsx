import { GitHubCalendar } from "react-github-calendar";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import { fadeUp, viewportOnce } from "@/lib/animations";

export function GitHubStats() {
  return (
    <motion.section
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="py-12 px-6 border-t border-border"
    >
      <div className="max-w-content mx-auto space-y-4">
        <a
          href="https://github.com/Jrkesari"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-muted hover:text-gray-900 transition-colors"
        >
          <Github size={14} />
          <span className="font-mono">@Jrkesari</span>
        </a>

        <div className="overflow-x-auto">
          <GitHubCalendar
            username="Jrkesari"
            colorScheme="light"
            theme={{
              light: ["#f3f4f6", "#bfdbfe", "#93c5fd", "#3b82f6", "#1d4ed8"],
            }}
            style={{
              fontFamily: "inherit",
              fontSize: 12,
            }}
            labels={{
              totalCount: "{{count}} contributions in {{year}}",
            }}
          />
        </div>
      </div>
    </motion.section>
  );
}
