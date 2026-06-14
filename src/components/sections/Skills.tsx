import { motion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

export function Skills() {
  return (
    <section id="skills" className="py-20 px-6 border-t border-border">
      <div className="max-w-content mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-10"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="flex items-baseline gap-3">
            <span className="font-mono text-sm text-muted">04</span>
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tighter text-[#171717]">
              Skills
            </h2>
          </motion.div>

          {/* Skill groups */}
          <motion.div variants={stagger} className="space-y-6">
            {skillGroups.map((group) => (
              <motion.div key={group.label} variants={fadeUp} className="flex flex-col sm:flex-row gap-3">
                <p className="text-xs font-mono text-muted sm:w-28 flex-shrink-0 pt-0.5">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs text-gray-700 bg-surface border border-border px-2.5 py-1 rounded hover:border-accent hover:text-accent transition-colors cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
