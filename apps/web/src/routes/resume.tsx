import { resume, site } from "@jrk/content";
import { createFileRoute } from "@tanstack/react-router";
import { Seo } from "@/components/Seo";

export const Route = createFileRoute("/resume")({
  component: Resume,
});

function Resume() {
  return (
    <main className="resume shell pt-32 pb-10 md:pt-40">
      <Seo
        title="Résumé · Jayesh Ranjan Kesari"
        description="One-page résumé of Jayesh Ranjan Kesari, AI engineer: agent runtimes, MCP tool servers and LLM infrastructure. Also as PDF, JSON and Markdown."
        path="/resume"
        kind="ProfilePage"
        crumbs={[{ name: "Résumé", path: "/resume" }]}
      />
      <div className="no-print mx-auto mb-10 flex max-w-[50rem] flex-wrap items-center justify-between gap-4">
        <p className="label">résumé · one page, printable</p>
        <div className="mono flex gap-4 text-[12px]">
          <a className="link" href="/resume.pdf" download="Jayesh-Ranjan-Kesari-Resume.pdf">
            download pdf
          </a>
          <a className="link" href="/resume.md">
            markdown
          </a>
          <a className="link" href="/resume.json">
            json
          </a>
          <button type="button" className="link" onClick={() => window.print()}>
            print
          </button>
        </div>
      </div>

      <article className="resume-sheet mx-auto max-w-[50rem] rounded-[4px] border border-rule bg-card px-6 py-10 sm:px-12 sm:py-14">
        <header className="text-center">
          <h1 className="font-serif text-[2.6rem] leading-none font-light tracking-[-0.03em]">{site.name}</h1>
          <p className="mt-3 text-ink-2">{resume.title}</p>
          <p className="mono mt-3 text-[11.5px] text-graphite">
            <a href={`mailto:${site.email}`}>{site.email}</a> · <a href={site.socials[0].href}>github.com/Jrkesari</a> ·{" "}
            <a href={site.socials[1].href}>linkedin</a> · <a href={site.url}>{new URL(site.url).host}</a>
          </p>
        </header>

        <section className="mt-9">
          <h2 className="resume-h">Profile</h2>
          <p className="text-[0.98rem] text-ink-2">{resume.summary}</p>
        </section>

        <section className="mt-7">
          <h2 className="resume-h">Skills</h2>
          <dl className="grid gap-x-4 gap-y-1.5 text-[0.95rem] sm:grid-cols-[6.5rem_minmax(0,1fr)]">
            {resume.skills.map((s) => (
              <div key={s.label} className="contents">
                <dt className="font-medium text-ink">{s.label}</dt>
                <dd className="m-0 text-ink-2">{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-7">
          <h2 className="resume-h">Experience</h2>
          <div className="space-y-6">
            {resume.experience.map((e) => (
              <div key={e.org}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <p className="text-ink">
                    <span className="font-medium">{e.org}</span> · {e.role}
                  </p>
                  <p className="mono text-[11.5px] text-graphite">
                    {e.when} · {e.where}
                  </p>
                </div>
                {e.groups.map((g) => (
                  <div key={g.heading || e.org} className="mt-2.5">
                    {g.heading && <p className="text-[0.92rem] font-medium text-ink">{g.heading}</p>}
                    <ul className="mt-1 space-y-1 text-[0.92rem] text-ink-2">
                      {g.bullets.map((b) => (
                        <li key={b} className="grid grid-cols-[0.9rem_minmax(0,1fr)]">
                          <span aria-hidden className="text-graphite">
                            ·
                          </span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <section className="mt-7">
          <h2 className="resume-h">Projects</h2>
          <ul className="space-y-2.5 text-[0.92rem]">
            {resume.projects.map((p) => (
              <li key={p.name}>
                <span className="font-medium text-ink">{p.name}.</span> <span className="text-ink-2">{p.detail}</span>{" "}
                <span className="mono text-[11px] text-graphite">{p.stack}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-7">
          <h2 className="resume-h">Education &amp; certifications</h2>
          {resume.education.map((ed) => (
            <p key={ed.school} className="flex flex-wrap justify-between gap-x-4 text-[0.95rem]">
              <span>
                <span className="font-medium text-ink">{ed.school}</span>{" "}
                <span className="text-ink-2">
                  · {ed.degree} · {ed.grade}
                </span>
              </span>
              <span className="mono text-[11.5px] text-graphite">{ed.when}</span>
            </p>
          ))}
          <ul className="mt-2 space-y-0.5 text-[0.92rem] text-ink-2">
            {resume.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </article>
    </main>
  );
}
