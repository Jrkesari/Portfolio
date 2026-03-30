import { motion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

export function Skills() {
  return (
    <section id="skills" className="py-16 px-6 border-t border-border">
      <div className="max-w-content mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeUp}>
            <span className="font-mono text-xs text-muted mr-2">04</span>
            <h2 className="inline text-base font-semibold text-gray-900">Skills</h2>
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
                      className="font-mono text-xs text-gray-700 bg-gray-50 border border-border px-2.5 py-1 rounded hover:border-accent hover:text-accent transition-colors cursor-default"
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
