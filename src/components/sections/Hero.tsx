import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, FileText, ArrowUpRight } from "lucide-react";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/Jrkesari",
    icon: Github,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jayesh-ranjan-kesari-2573b3252/",
    icon: Linkedin,
  },
  {
    label: "Twitter",
    href: "https://x.com/me_jayeshrkesar",
    icon: Twitter,
  },
];

export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-content mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={fadeUp} className="space-y-1">
            <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
              Jayesh Ranjan Kesari
            </h1>
            <p className="text-base text-muted">
              AI Engineer — Agents · Automation · LLMs
            </p>
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-[15px] text-gray-600 leading-relaxed max-w-lg"
          >
            Building agents and automation pipelines at{" "}
            <span className="text-gray-900 font-medium">Netision Technology</span>
            . Currently working on a multi-agent analytics platform.
          </motion.p>

          <motion.div variants={fadeUp} className="flex items-center gap-5">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted hover:text-gray-900 transition-colors"
              >
                <Icon size={15} />
                <span>{label}</span>
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-accent hover:text-accent-dark transition-colors font-medium"
            >
              <FileText size={15} />
              <span>Resume</span>
              <ArrowUpRight size={12} />
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="pt-2 flex items-center gap-2 text-xs text-muted"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>Available for freelance & collaborations</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
