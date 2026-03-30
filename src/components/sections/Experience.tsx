import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

export function Experience() {
  return (
    <section id="experience" className="py-16 px-6 border-t border-border">
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
            <span className="font-mono text-xs text-muted mr-2">03</span>
            <h2 className="inline text-base font-semibold text-gray-900">Experience</h2>
          </motion.div>

          {/* Timeline */}
          <motion.div variants={stagger} className="space-y-0 relative">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.id}
                variants={fadeUp}
                className={`py-6 ${i < experiences.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 mb-3">
                  <div>
                    <h3 className="text-[15px] font-medium text-gray-900">{exp.role}</h3>
                    <p className="text-sm text-muted">
                      {exp.company}
                      <span className="mx-2">·</span>
                      <span className="text-xs">{exp.type}</span>
                      <span className="mx-2">·</span>
                      <span className="text-xs">{exp.mode}</span>
                    </p>
                  </div>
                  <p className="font-mono text-xs text-muted whitespace-nowrap sm:text-right flex-shrink-0">
                    {exp.startDate} — {exp.endDate ?? "Present"}
                  </p>
                </div>

                <ul className="space-y-1.5 mb-3">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="text-sm text-gray-600 flex gap-2">
                      <span className="text-muted mt-0.5 flex-shrink-0">—</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5">
                  {exp.skills.map((skill) => (
                    <span
                      key={skill}
                      className="font-mono text-xs text-muted bg-gray-50 px-2 py-0.5 rounded border border-border"
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
