import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, ArrowUpRight, ExternalLink, Plus } from "lucide-react";
import { projects, type ProjectCategory } from "@/data/projects";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const filters: { label: string; value: ProjectCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "AI / Agent", value: "ai" },
  { label: "Web", value: "web" },
];

export function Projects() {
  const [activeFilter, setActiveFilter] = useState<ProjectCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const filtered =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.categories.includes(activeFilter));

  return (
    <section id="projects" className="py-20 px-6 border-t border-border">
      <div className="max-w-content mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-10"
        >
          {/* Bold section header */}
          <motion.div variants={fadeUp} className="flex items-end justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-muted">02</span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-[#171717]">
                Projects
              </h2>
            </div>
            {/* Filter tabs */}
            <div className="flex items-center gap-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setActiveFilter(f.value)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilter === f.value
                      ? "bg-[#171717] text-[#F7F4EE]"
                      : "text-muted hover:text-[#171717]"
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
            className="border-t border-border"
          >
            {filtered.map((project, i) => {
              const isOpen = openId === project.id;
              return (
                <motion.div
                  key={project.id}
                  variants={fadeUp}
                  className="border-b border-border"
                >
                  <button
                    onClick={() => setOpenId(isOpen ? null : project.id)}
                    className="w-full text-left py-6 flex items-start gap-4 group"
                  >
                    {/* Index */}
                    <span className="font-mono text-xs text-muted pt-1 w-7 flex-shrink-0 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="text-lg font-medium text-[#171717] tracking-tight group-hover:text-accent-dark transition-colors">
                          {project.name}
                        </h3>
                        {project.group && (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-muted px-1.5 py-0.5 border border-border rounded">
                            {project.group}
                          </span>
                        )}
                      </div>

                      {project.highlight && (
                        <p className="font-mono text-xs text-muted">{project.highlight}</p>
                      )}

                      <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
                        {project.description}
                      </p>

                      {/* Expandable detail */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm text-muted leading-relaxed max-w-xl pt-1 pb-2">
                              {project.longDescription}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-xs text-muted bg-surface px-2 py-0.5 rounded border border-border"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right rail: links + expand affordance */}
                    <div className="flex items-center gap-3 flex-shrink-0 pt-1">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted hover:text-[#171717] transition-colors"
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
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted hover:text-accent transition-colors"
                          aria-label="Live demo"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                      <Plus
                        size={16}
                        className={`text-muted transition-transform duration-200 ${
                          isOpen ? "rotate-45 text-[#171717]" : ""
                        }`}
                      />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </motion.div>

          {/* GitHub link */}
          <motion.div variants={fadeUp}>
            <a
              href="https://github.com/Jrkesari"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-[#171717] transition-colors"
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
