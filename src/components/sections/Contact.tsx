import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

export function Contact() {
  return (
    <section id="contact" className="border-t border-border">
      {/* Footer — right-aligned text block */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="max-w-content mx-auto px-6 py-20 flex justify-end"
      >
        <div className="max-w-xs space-y-4">
          <motion.p variants={fadeUp} className="text-[15px] text-[#171717] leading-relaxed">
            AI agents and developer tools. Built for Netision Technology, and ongoing personal projects in automation, voice AI, and observability.
          </motion.p>

          <motion.p variants={fadeUp} className="text-[15px] text-[#171717] leading-relaxed">
            Open to collaborations, freelance work, or just a conversation about AI.
          </motion.p>

          <motion.div variants={fadeUp}>
            <a
              href="mailto:jrkesari@gmail.com"
              className="text-[15px] text-[#171717] hover:opacity-60 transition-opacity"
            >
              jrkesari@gmail.com
            </a>
          </motion.div>
        </div>
      </motion.div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} Jayesh Ranjan Kesari
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "GitHub", href: "https://github.com/Jrkesari" },
              { label: "LinkedIn", href: "https://www.linkedin.com/in/jayesh-ranjan-kesari-2573b3252/" },
              { label: "Twitter", href: "https://x.com/me_jayeshrkesar" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted hover:text-[#171717] transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
