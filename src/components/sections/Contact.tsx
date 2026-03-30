import { motion } from "framer-motion";
import { useForm } from "@tanstack/react-form";
import { Github, Linkedin, Twitter, Mail, Send } from "lucide-react";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import { fadeUp, stagger, viewportOnce } from "@/lib/animations";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? "";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? "";

const socialLinks = [
  { label: "GitHub", href: "https://github.com/Jrkesari", icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jayesh-ranjan-kesari-2573b3252/", icon: Linkedin },
  { label: "Twitter", href: "https://x.com/me_jayeshrkesar", icon: Twitter },
  { label: "Email", href: "mailto:jrkesari@gmail.com", icon: Mail },
];

interface FormValues {
  name: string;
  email: string;
  message: string;
}

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const form = useForm<FormValues>({
    defaultValues: { name: "", email: "", message: "" },
    onSubmit: async ({ value }) => {
      setStatus("sending");
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: value.name,
            reply_to: value.email,
            message: value.message,
          },
          EMAILJS_PUBLIC_KEY
        );
        setStatus("sent");
        form.reset();
      } catch {
        setStatus("error");
      }
    },
  });

  return (
    <section id="contact" className="py-16 px-6 border-t border-border">
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
            <span className="font-mono text-xs text-muted mr-2">05</span>
            <h2 className="inline text-base font-semibold text-gray-900">Contact</h2>
          </motion.div>

          <motion.p variants={fadeUp} className="text-sm text-muted max-w-md">
            Open to interesting projects, collaborations, and full-time opportunities.
            Drop a message or reach out directly.
          </motion.p>

          {/* Contact form */}
          <motion.div variants={fadeUp} className="max-w-md">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void form.handleSubmit();
              }}
              className="space-y-4"
            >
              <form.Field name="name">
                {(field) => (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Name
                    </label>
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      required
                      placeholder="Your name"
                      className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-accent transition-colors placeholder:text-gray-400"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="email">
                {(field) => (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      required
                      placeholder="you@example.com"
                      className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-accent transition-colors placeholder:text-gray-400"
                    />
                  </div>
                )}
              </form.Field>

              <form.Field name="message">
                {(field) => (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      required
                      rows={4}
                      placeholder="What's on your mind?"
                      className="w-full px-3 py-2 text-sm bg-white border border-border rounded-lg focus:outline-none focus:border-accent transition-colors placeholder:text-gray-400 resize-none"
                    />
                  </div>
                )}
              </form.Field>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <button
                    type="submit"
                    disabled={isSubmitting || status === "sending" || status === "sent"}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-accent text-white rounded-lg hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={14} />
                    {status === "sending"
                      ? "Sending..."
                      : status === "sent"
                      ? "Sent!"
                      : "Send message"}
                  </button>
                )}
              </form.Subscribe>

              {status === "error" && (
                <p className="text-xs text-red-500">
                  Something went wrong. Email me directly at{" "}
                  <a href="mailto:jrkesari@gmail.com" className="underline">
                    jrkesari@gmail.com
                  </a>
                </p>
              )}
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={fadeUp}
            className="pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="flex items-center gap-5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-gray-900 transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            <p className="font-mono text-xs text-muted">
              © {new Date().getFullYear()} Jayesh Ranjan Kesari
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
