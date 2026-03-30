import { useState } from "react";
import { motion } from "framer-motion";
import { Github, ArrowUpRight, ExternalLink } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/projects";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const filters: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "AI / Agent", value: "ai" },
  { label: "Web", value: "web" },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter));

  return (
    <section id="projects" className="py-16 px-6 border-t border-border">
      <div className="max-w-content mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-baseline justify-between">
            <div>
              <span className="font-mono text-xs text-muted mr-2">02</span>
              <h2 className="inline text-base font-semibold text-gray-900">Projects</h2>
            </div>
            {/* Filter tabs */}
            <div className="flex items-center gap-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-accent text-white"
                      : "text-muted hover:text-gray-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Project list */}
          <motion.div
            key={activeFilter}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-0"
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                variants={fadeUp}
                className={`py-5 flex items-start justify-between gap-4 group cursor-default ${
                  i < filtered.length - 1 ? "border-b border-border" : ""
                }`}
              >
                <div className="flex-1 space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-accent transition-colors">
                      {project.name}
                    </h3>
                    {project.highlight && (
                      <span className="text-xs font-mono text-muted px-2 py-0.5 bg-gray-50 rounded border border-border truncate hidden sm:inline">
                        {project.highlight}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="font-mono text-xs text-muted bg-gray-50 px-2 py-0.5 rounded border border-border"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Links */}
                <div className="flex items-center gap-3 flex-shrink-0 pt-0.5">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-gray-900 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github size={16} />
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted hover:text-accent transition-colors"
                      aria-label="Live demo"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* GitHub link */}
          <motion.div variants={fadeUp}>
            <a
              href="https://github.com/Jrkesari"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-gray-900 transition-colors"
            >
              <Github size={14} />
              <span>View all on GitHub</span>
              <ArrowUpRight size={12} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
