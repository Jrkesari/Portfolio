import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, FileText, ArrowUpRight } from "lucide-react";
import { fadeUp, stagger } from "@/lib/animations";
import { HeroBot } from "@/components/HeroBot";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Jrkesari", icon: Github },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/jayesh-ranjan-kesari-2573b3252/",
    icon: Linkedin,
  },
  { label: "Twitter", href: "https://x.com/me_jayeshrkesar", icon: Twitter },
];

export function Hero() {
  return (
    <section className="pt-36 pb-24 px-6">
      {/* Wider than the content column so the hero can breathe into two columns */}
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-10 items-center">
        {/* Left — identity */}
        <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-8">
          {/* Status line — technical mono */}
          <motion.div
            variants={fadeUp}
            className="flex items-center gap-2 font-mono text-xs text-muted"
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
            <span className="uppercase tracking-[0.18em]">AI Engineer · Netision</span>
          </motion.div>

          {/* Oversized display headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(2.75rem,8vw,5rem)] font-semibold leading-[0.95] tracking-tighter text-[#171717]"
          >
            Jayesh
            <br />
            <span className="text-muted">Kesari</span>
          </motion.h1>

          {/* Mono sub-identity */}
          <motion.p variants={fadeUp} className="font-mono text-sm text-[#171717] -mt-2">
            <span className="text-muted">{">"}</span> building agents · automation · LLM pipelines
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-[15px] text-gray-600 leading-relaxed max-w-md"
          >
            I design multi-agent systems and automation pipelines at{" "}
            <span className="text-[#171717] font-medium">Netision Technology</span> — currently a
            multi-agent analytics platform. 2+ years shipping generative-AI products.
          </motion.p>

          {/* Links */}
          <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 text-sm text-muted hover:text-[#171717] transition-colors"
              >
                <Icon size={15} />
                <span className="border-b border-transparent group-hover:border-current">
                  {label}
                </span>
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-[#171717] hover:gap-2 transition-all"
            >
              <FileText size={15} />
              <span>Resume</span>
              <ArrowUpRight size={12} />
            </a>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-1 font-mono text-xs text-muted">
            available for freelance &amp; collaborations
          </motion.div>
        </motion.div>

        {/* Right — terminal panel fills the empty space on wide screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
          className="hidden lg:block"
        >
          <HeroBot />
        </motion.div>
      </div>
    </section>
  );
}
