# jayesh.cv, v3

My portfolio: warm paper, box-drawing figures that light up, and the decisions behind the systems I build.
A Turborepo + pnpm workspace.

```
.
├── apps/
│   └── web/                 the site: Vite, React 19, TanStack Router, Tailwind 4, Lenis, cmdk
│       ├── src/routes/      file-based routes (code-split)
│       ├── src/components/  home sections, layout (header, ⌘K palette, tl;dr, screensaver)
│       ├── scripts/         generate.ts → llms.txt, resume.json/.md, sitemap.xml; contributions.ts → GitHub counts
│       └── public/fonts/    subset, self-hosted fonts (see OFL.txt)
├── packages/
│   ├── ascii/               box-drawing diagram engine: parser, React renderer, styles, tests
│   ├── content/             everything the site says, as typed data, with contract tests
│   └── tsconfig/            shared compiler settings
├── api/                     Vercel functions (prompt golf)
└── turbo.json               generate → build → contributions; typecheck, test, dev
```

## Run it

```sh
pnpm install
pnpm dev          # turbo: generate, then vite on :5173
pnpm check        # typecheck + tests across the workspace, then Biome
pnpm format       # Biome: format and sort imports (content data is left hand-laid)
pnpm build        # what Vercel runs: generate → build → contributions
```

Node 22 (`.node-version`), pnpm 10 with the isolated linker: the same layout Vercel installs, so a dependency
that isn't declared fails here first. On Windows, keep the checkout's path short (about 110 characters or less):
node.exe isn't long-path aware, and the isolated store nests deep enough for `vite build` to trip over it.

`generate` is pure and cached: the same content always writes the same `llms.txt`, `resume.json` and `sitemap.xml`.
The GitHub contribution counts are the build's one network call, so they run uncached after every build and write
into `dist/` directly; if the API is down, the page falls back to the last numbers it knew.

## Why it looks like this

[`docs/research.md`](docs/research.md) is the research behind v3: 257 personal sites across nine lanes (people at
Anthropic and OpenAI, explorable explainers, design engineers, creative portfolios, developers in India, AI
builders, résumé formats, 2025–26 trends), what makes a site read as authored rather than generated, and fifteen
ideas, several of which are built here.

## Editing content

All words and numbers live in `packages/content/src/`:

| file | what |
|---|---|
| `profile.ts` | hero copy, tl;dr card |
| `systems.ts` | the six case studies (`/work/:slug`) and the "earlier & smaller" list |
| `rules.ts` | Rules I work by |
| `replay.ts` | the five scripted traces in *Anatomy of a turn* and their diagram |
| `figures.ts`, `diagrams.ts` | the ASCII figures and their steps |
| `notes.ts` | field notes; `status: "draft"` shows a draft tag until you flip it |
| `about.ts` | career graph, receipt, toolbox, /now, /uses |
| `resume.ts` | `/resume`, the PDF and `resume.json` |
| `inspirations.ts` | the credits list on `/colophon` |

`pnpm --filter @jrk/content test` checks that every figure step names boxes that exist and lines that are drawn,
that every replay span lights real parts of its diagram, and that every metric says where it came from.

### Drawing a figure

A figure is plain text. Boxes are `┌─┐ │ └─┘` (or `╭╮╰╯`, `╔╗╚╝`), lines are `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`, dashed
lines `┄ ┆`, and arrowheads `▶ ◀ ▲ ▼` are one-way. A box's id is its label, slugged (`agent loop` → `agent-loop`).
`┼` is a junction where lines merge; draw a crossing that must go straight as `╪`/`╫`. Keep arrowheads outside box
borders.

### The résumé PDF

`apps/web/public/resume.pdf` is printed from `/resume` (A4, one page). After changing `resume.ts`, open `/resume`,
press *print*, and save as PDF over that file.

## Deploying

`vercel.json` at the root installs with pnpm and builds `@jrk/web` through turbo; output is `apps/web/dist`, and
`api/` stays at the root so the existing Vercel project needs no settings change. If you'd rather point Vercel's
Root Directory at `apps/web`, move `api/` and `vercel.json` there.
