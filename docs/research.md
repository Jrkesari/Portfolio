<!-- The research behind v3, compiled overnight on 2026-10-09 with Claude. Public copy:
     private notes about employer systems are left out. -->

# Portfolio research: what 257 personal sites say about v3

For Jayesh. Compiled overnight, 2026-10-09, for the `v3-redesign` branch.

**What this is.** A synthesis of nine research lanes:

- Anthropic people
- OpenAI people
- explorable explainers
- design engineers
- creative and award-winning portfolios
- Indian developers
- AI builders at other labs and startups
- CV and résumé formats
- 2025–26 trends

Every site in section 2 was opened live on 2026-10-09 by the lane that found it. The raw lane notes, and the notes about my own repositories that this draws on, are kept out of the repo: some of them name internal systems and clients.

**How to read it.** Sections 1, 3 and 7 are the morning read, about ten minutes. Section 2 is the reference table: skim the one-line lane summaries, then come back to individual rows when a design question comes up. The appendix lists what I corrected in the lane notes and what was not counted.

---

## 1. TL;DR

- **The authored sites share one shape (257 verified sites, 243 of them individuals' own sites).**
  - The home page is a quiet, dated list.
  - Depth lives in two or three pieces.
  - There is exactly one signature device.
  - Metadata is honest: status, dates, versions, "my part".
  - Every number has a condition and a date.
  - Motion explains a change of state, and the reader controls the pace.
  - None of the strongest sites in the Anthropic, OpenAI and explorables lanes use scroll-jacking, typing headlines, cursor trails or scrambled text.
- **v3's biggest risk is its colour scheme's genre, not its code.**
  - In June 2026 Kyle Chayka described the look in The New Yorker (cream ground, rust-orange accent, big serif, letter-spaced capitals), and coverage calls it the "Claude aesthetic" (Pixel Envy, Tildes). Designers began leaving it (Naz Hamid, "Fade to Blue").
  - I re-measured v3's colours. They are no longer Anthropic's exact colours (paper ΔE 3.6, ink ΔE 12.4), but the genre still reads as AI-built.
  - Fix:
    - Make neel (indigo) the structural colour.
    - Keep kesari only for things that move.
    - Drop the letter-spaced capital labels.
    - Let identity come from interactions only your content can produce.
- **Show the AI architecture the way the best explainers do, without a chatbot.**
  - Define a small legend first (Chris Olah).
  - Walk one real, sanitised request through your stack, lighting one part at a time. A counter shows ms, tokens and cost (ccunpacked.dev, Nick Tikhonov, Jay Alammar, Chip Huyen).
  - The reader sets the pace, 0.5× by default. A static waterfall underneath covers print and reduced motion (Mike Bostock).
  - Show your thinking with:
    - decision cards that hide your answer until the reader guesses (Lena Voita);
    - rejected options kept with their numbers;
    - numbered beliefs;
    - open questions.
- **"Lazy" has a precise meaning here: slow for reading, instant for input.**
  - Clicks, keys and toggles respond in 120–200 ms (Rauno Freiberg, Emil Kowalski, Jakub Krehel).
  - Slowness is reserved for:
    - one-time reveals (600–1000 ms);
    - page-to-page transitions (450–700 ms);
    - background layers that grow once and stop (Anthony Fu, Flora Guo);
    - changes too slow to watch, such as the page's light following Noida's time of day (Felix Rieseberg, Bruno Simon).
- **The AI-native move that isn't a chatbot: make the site readable by AI agents, built the way you build production servers.**
  - Markdown copies of every page, served when an agent asks for `text/markdown`.
  - An `llms.txt` that says when to refer you and when not to.
  - An exact `/ai` page: what AI wrote here, what you decided.
  - A small read-only `/mcp` endpoint. Only one portfolio out of 257 has a real one (Arthur Monnet).
  - Be candid that most agents don't fetch these files yet: Ahrefs found 97% of llms.txt files got zero requests in May 2026.

---

## 2. The sites

### Counting rules

- **Verified** means the lane researcher opened the live page, or its served HTML or source, on 2026-10-09.
  - Where only part of a site could be observed, the row says so.
  - Affiliations are as each site stated them that day, unless marked "third-party" or "unconfirmed".
- **Each site is counted once**, in the lane where it got its main entry.
  - Cross-lane appearances are noted in the row. For example, Karpathy is counted under Anthropic but also appears in the OpenAI and CV lanes.
- **Not counted:**
  - **Corroborated only:** neal.fun (it served a Cloudflare challenge, so its content is known only from other sources).
  - **Search only:** Sam Bowman.
  - **Nothing observable:** Alana Goyal and Alex Widua (JS-only); Preston Booth and Chloe Yan (no server-rendered content).
  - **Opened but nothing recorded:** akkartik.name, adit.io, anish.io, sahillavingia.com, gilhuybrecht.com, flavorfulsuffering.xyz.
  - **Dead or parked domains:** shancarter.com, sholtodouglas.com, willdepue.com, romainhuet.com, lukaszkaiser.com, read.cv (HTTP 402), and others listed in the lane files.
  - **The survey of 102 IndieWebClub Bangalore homepages,** which is summarised in lane F's intro instead.
- **Total: 257 verified sites.**
  - 243 are individuals' sites or personal projects.
  - 14 are team, lab, studio, journal or template entries.
  - 70 come from the two lab lanes: 35 Anthropic and 35 OpenAI, current or former. A few of those affiliations are third-party or unconfirmed, and the rows say so.
  - Three more lab people sit in other lanes: Chase McCoy and Eugene Yan (Anthropic) and Gavin Nelson (OpenAI).

| Lane | Source file | Sites counted | Team, studio or template among them |
|---|---|---|---|
| A. Anthropic people | `web-anthropic.md` | 35 | 1 |
| B. OpenAI people | `web-openai.md` | 35 | 2 |
| C. Explorable explainers | `web-explorables.md` | 29 | 3 |
| D. Design engineers | `web-design-engineers.md` | 34 | 0 |
| E. Creative and award portfolios | `web-creative.md` | 25 | 1 |
| F. Indian developers | `web-india.md` | 42 | 0 |
| G. AI builders (other labs, startups) | `web-ai-builders.md` | 31 | 1 |
| H. CV and résumé formats | `web-cv.md` | 16 | 5 |
| I. Trends 2025–26 | `trends.md` | 10 | 1 |
| **Total** | | **257** | **14** |

In the last column, "Take" means borrow for v3 and "Skip" means don't.

### A. Anthropic people (35)

**What this lane taught:**
- Lists beat grids.
- Process is published as content.
- Explanations use a fixed visual vocabulary, defined first.
- Designers commit to one strong idea; engineers keep their sites plain. The weak middle is a template plus effects.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Chris Olah | Anthropic co-founder, interpretability | https://colah.github.io | A legend comes before the mechanics; the same diagram is reused with one part lit per figure; variants are shown as edits of the base diagram; a "Rough Notes" shelf says it's rough | Take: a 5-symbol legend and one-part-at-a-time stepping for your runtime figure; an honestly labelled rough-notes shelf |
| 2 | Transformer Circuits Thread | Anthropic interpretability team (team site) | https://transformer-circuits.pub | Research as a dated running thread, with monthly update digests and paper / note / infrastructure tags; a fixed line vocabulary in its diagrams | Take: a dated field-notes thread with type tags; a line vocabulary (solid = call, dotted = async, T-end = blocked). Skip: the Distill/Tiempos look, which people in the field recognise instantly |
| 3 | Felix Rieseberg | Anthropic (Claude); Electron co-maintainer | https://felixrieseberg.com | The site is a real place and time: a three.js room by a rainy Berlin window; sections are TV channels; "enter muted"; a full text fallback | Take: anchor the site to Noida and IST; a keyboard-shortcut legend; the text fallback as a first-class page. Skip: the 3D room |
| 4 | Nate Parrott | Anthropic design (Claude Code in VS Code, per Designer Fund) | https://nateparrott.com | One satirical idea taken all the way: an "engagement-driven" site with coins and a slot machine; handmade Blender characters | Take: commit fully to one idea; handmade objects instead of logos. Skip: the game mechanics (ruled out) |
| 5 | Jenny Wen | Ex-design lead for Claude and Cowork at Anthropic (her site) | https://jennywen.ca | One month-stamped feed mixing launches, talks and tiny toys; warm, self-deprecating captions; one quirky italic face for accents | Take: a month-stamped feed where shipped systems and small experiments sit together; one accent face, used sparingly |
| 6 | Andrej Karpathy | OpenAI founding member; joined Anthropic May 2026 (press) | https://karpathy.ai | A tiny framework-free page with in-jokes, an honest note about email and a "0 frameworks" colophon; videos in two tracks (technical and general audience); microgpt built up as files `train0` → `train5`; an unbuilt "converging loss curve" idea left in an HTML comment | Take: two depths per architecture; a `v0 → v5` build ladder; the converging curve as the one slow hero animation; a candid colophon. Also appears in the OpenAI and CV lanes |
| 7 | Adam Pearce | Anthropic interpretability (biology paper) | https://roadtolarissa.com | About 150 lowercase rows grouped by year, each with a 100×50 thumbnail, favourites in magenta; explainers go question → visual → interpretation, starting from a toy model | Take: an /index of everything with favourites in kesari; toy-first explainers |
| 8 | Tristan Hume | Anthropic, performance team | https://thume.ca | A "Stuff I've Done" log from 2005 to 2022; he measures his own tools (keyboard-to-photon latency); posts start with the diagram | Take: a "since 2022" log; one measured artifact from your real systems |
| 9 | Nicholas Carlini | Anthropic research scientist | https://nicholas.carlini.com | Constraint art (tic-tac-toe in one `printf`, a Doom clone in 13 kB) next to a public research-idea log and forecasts he scores later | Take: an ideas log with outcome marks; predictions with dates to score them; optionally one tiny constrained build |
| 10 | Jack Clark | Anthropic co-founder, policy | https://jack-clark.net | Import AI: a "Why this matters" note after each item and a closing short story with "Things that inspired this story" | Take: a "Why this matters" ending for case studies; a 100-word story told by a request |
| 11 | Den Delimarsky | Anthropic, lead maintainer of MCP | https://den.dev | A blog that measures itself (years, posts, words, a /stats page) and a /how-i-work manual; "/" opens search | Take: a quiet stats strip, /how-i-work and "/" search. He maintains MCP, so the overlap with your work is direct |
| 12 | Joe Carlsmith | Anthropic (Claude's constitution) | https://joecarlsmith.com | The site's sections mirror his intellectual map: foundational topics feed applied ones; long multi-part series; audio versions | Take: a "how my work connects" map. Note: he also uses Newsreader, at an ultra-light weight, so set yours differently |
| 13 | Holden Karnofsky | Anthropic staff (third-party sources) | https://www.cold-takes.com | Slowness as the brand: posts are drafted a month before they're published | Take: "drafted → published" dates on notes. Skip: the email pop-up |
| 14 | Andy Jones | Anthropic engineer-researcher | https://andyljones.com | Writing split into "Indie" and "Anthropic"; projects tiered Major / Minor / Old; "Horses": one chart per section with a repeated line | Take: an "Indie / At work" split; tiers that keep lists short |
| 15 | Julian Schrittwieser | Anthropic researcher | https://www.julian.ac | Performance as aesthetic (homepage cut from 242 kB to 43 kB); an /opinions page; small life pages | Take: a page-weight budget, stated and met; /opinions |
| 16 | Thariq Shihipar | Anthropic, Claude Code | https://www.thariq.io | A Professional ⇄ Personal toggle that swaps both portrait and theme; an honest status label on every project | Take: status labels (prototype · in production · retired) |
| 17 | Boris Cherny | Anthropic, creator of Claude Code | https://borischerny.com | He published his six-step decision process ("I am often wrong") | Take: a "how I think" loop, in your own steps |
| 18 | Nelson Elhage | Ex-Anthropic, interpretability | https://blog.nelhage.com | Side collections in one narrow genre (Accidentally Quadratic, debugging war stories) | Take: "Agent failures, catalogued", a collection of real failure modes |
| 19 | Ben Kuhn | Anthropic | https://www.benkuhn.net | Featured essays, each with a "·"-separated line of subtopics | Take: a subtopic line under each case-study title |
| 20 | Alex Albert | Anthropic, Claude Relations | https://alexalbert.me | A four-sentence bio that is a story about a place | Take: a short origin paragraph about a place |
| 21 | Saffron Huang | Anthropic, Societal Impacts | https://saffronhuang.com | A section called "Work I hope you'll read" | Take: modest, specific section names instead of "Featured projects" |
| 22 | Alex Tamkin | Anthropic researcher | https://www.alextamkin.com | Photography and Ceramics pages next to the research | Take: one made-by-hand page (your photography, if you opt in) |
| 23 | Adam Jermyn | Anthropic (biology paper author) | https://adamjermyn.com | /workflow, Bookshelf and Lectures pages; an anonymous feedback link | Take: /workflow; an anonymous feedback link |
| 24 | Dario Amodei | Anthropic CEO | https://www.darioamodei.com | Long essays open with "Basic assumptions and framework" before the argument; bold is used only for key claims | Take: an "Assumptions and constraints" block at the top of each write-up |
| 25 | Karina Nguyen | Ex-Anthropic and OpenAI | https://karinanguyen.com | Credits an unusual past (OSINT, visual forensics) next to the AI research | Take: show your non-AI origins (campus photography and multimedia lead roles) |
| 26 | Neel Nanda | Ex-Anthropic; Google DeepMind | https://www.neelnanda.io | Numbered posts, "deliberately not quality controlled" | Take: numbered notes; honest quality labels. Skip: the template look |
| 27 | Jascha Sohl-Dickstein | Anthropic per third parties only (unconfirmed) | https://sohl-dickstein.github.io | A blog for ideas "too weird, incomplete, or off-topic" for papers; posts go hook → visual → theory | Take: the hook → visual → theory order |
| 28 | Amanda Askell | Anthropic | https://askell.io | Stock AcademicPages theme | Skip: the academic template (contrast case) |
| 29 | Trenton Bricken | Anthropic | https://trentonbricken.com | A single page: About, Publications, Talks | Skip: contrast case |
| 30 | Ethan Perez | Anthropic | https://ethanperez.net | Paper cards; a useful "Easy Paper Writing Tips" page | Skip: contrast case |
| 31 | Jan Leike | Anthropic | https://jan.leike.name | A single page plus a Substack | Skip: contrast case |
| 32 | Zac Hatfield-Dodds | Anthropic | https://zhd.dev | A single page; notes that he has no social media | Skip: contrast case |
| 33 | Jesse Mu | Anthropic | https://jesse.mu | Publications; Last.fm and Stack Overflow in the link row | Skip: contrast case |
| 34 | Durk Kingma | Anthropic | https://dpkingma.com | "2024 – Current: … at Anthropic" | Skip: contrast case |
| 35 | Avital Balwit | Anthropic, chief of staff | https://avitalbalwit.com | A bio plus a creative-writing section | Skip: contrast case |

### B. OpenAI people (35)

**What this lane taught:**
- The house style is plain. Personality lives in one sentence, one hidden joke and one well-known explanatory artifact.
- Most of the motion comes from designers, and two of the three most playful homepages are literal games.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Ilan Bigio | OpenAI (tools for research) | https://ilanbigio.com | Words in the bio do what they say: click "physical" and its letters fall under a physics engine (Matter.js), which loads only on that first click; an ASCII tree printed in the browser console | Take: 2–3 verbs in your intro that behave like your systems (for example, "stop" halts mid-word and keeps what was written, like your cancellation design); load the code only when needed; an ASCII diagram in the console |
| 2 | Ian Silber | OpenAI head of design | https://iansilber.com | The bio set as a ring of letters on a canvas that doubles as a 15-second puck game; the physics settings sit in a collapsed "tweaks" drawer, saved locally | Take: the settings drawer, wired to real constants in your lab demos. Skip: the game |
| 3 | Peter Steinberger | OpenAI (agents); made OpenClaw | https://steipete.me | A copy for agents: a request asking for `text/markdown` gets Markdown back, and every page has a `.md` URL; a "Steal this post" licence line | Take: Markdown copies of every page, served on request |
| 4 | Brendan Gregg | OpenAI, ChatGPT performance | https://www.brendangregg.com | Named methods (the USE Method) and interactive SVG flame graphs that also print | Take: one real request shown as a zoomable flame graph; a named debugging method of your own |
| 5 | Tim Brooks | Co-led Sora at OpenAI; now Meta | https://timothybrooks.com | Each section is a "room" with its own paper colour; all animation durations drop to 1 ms when the visitor has asked for reduced motion; smooth scrolling turns on only after the first click or key | Take: a paper colour per section with a slow crossfade; the same reduced-motion and smooth-scroll technique; a plain one-line headline |
| 6 | AI Futures Project | Former OpenAI researcher Daniel Kokotajlo and others (project site) | https://ai-2027.com | Dated chapters with a pinned dashboard that updates as you scroll; "Added <date>" amendment notes; PDF and audio editions | Take: "One request, start to finish" with a pinned diagram and counters; dated amendment notes. On mobile, use inline cards instead of the pinned panel |
| 7 | Lilian Weng | OpenAI (rejoined Jul 2026) | https://lilianweng.github.io | Long notes kept up as citable references: a table of contents, a "Cited as" block with BibTeX, blue "Updated" notes, an FAQ on how her diagrams are made | Take: "Cited as" blocks and dated update notes on architecture write-ups. Skip: reskinning her well-known agent diagram |
| 8 | Jason Wei | Ex-OpenAI; Meta Superintelligence Labs | https://www.jasonwei.net | About 82 numbered "Thoughts" grouped by year, kept separate from essays | Take: a numbered list of thoughts, expanded on your own page. Skip: leftovers from a site builder (a shop cart icon, "Lorem ipsum") |
| 9 | John Schulman | OpenAI co-founder; Thinking Machines | http://joschu.net | Designed to print like a paper (link URLs printed after each link, page margins, no stranded single lines); text selection looks like a yellow highlighter | Take: printing the page gives a clean one-page CV; a kesari text-selection colour |
| 10 | Leopold Aschenbrenner | Ex-OpenAI superalignment | https://situational-awareness.ai | One argument packaged as a book: chapters with blurbs, a PDF, a memorable first line and a dedication | Take: the architecture as a short book in parts, with a PDF edition |
| 11 | Calvin French-Owen | Ex-OpenAI | https://calv.info | A 16-year essay index that runs from B-trees to coding agents; a dated bookshelf; the Flexoki colour palette | Take: keep early writing to show how you got here; a dated /shelf |
| 12 | Joanne Jang | OpenAI Labs lead | https://joannejang.com | Very honest contact copy; a newsletter with a pun name ("Reservoir Samples") | Take: honest reply expectations; a pun from your own field for the notes stream. Skip: frosted-glass panels |
| 13 | Logan Kilpatrick | Ex-OpenAI developer relations; Google | https://logank.ai | "Some things I believe" under three headings | Take: a beliefs list. Skip: hidden text addressed to AI agents |
| 14 | Lucas Beyer | Ex-OpenAI; Meta | https://lucasb.eyer.be | A Konami-code easter egg; contact details written as code; long "Articles" kept apart from short "Snips" | Take: a key that outlines how the page is built (an x-ray view); a notes/snips split. Skip: the typing game and the hidden text for AIs |
| 15 | Justin Jay Wang | Ex-OpenAI and Cursor design | https://justinjay.wang | A sentence in the bio shows his San Francisco time, ticking | Take: "I'm in Noida, where it's 02:14", updating every minute |
| 16 | Maddie Simens | OpenAI design | https://maddie.ai | Time at OpenAI shown as a live counter | Take: at most one status-style line per page |
| 17 | Shunyu Yao | OpenAI researcher (page last updated Feb 2025) | https://ysymyth.github.io | A two-sentence bio ("I study agents."); his name in two scripts; "Recent readings"; essays that open with `tldr:` | Take: a two-sentence bio; your name in Devanagari; tldr-first essays |
| 18 | Jason Liu | OpenAI Codex team | https://jxnl.co | A personal site built as documentation, with a "User Manual" for working with him | Take: a /manual or /how-i-work page (pick one name) |
| 19 | Greg Brockman | OpenAI president | https://gregbrockman.com | "I love to build. I sometimes also blog." plus a curated list of systems reading | Take: "Interesting links": 8–12 systems readings, each with a one-line reason |
| 20 | Chelsea Voss | Ex-OpenAI (third-party sources) | https://csvoss.com | The motto "serious play"; a consistent series of generated SVG header images | Take: a header image per note, generated from the note's own data |
| 21 | Hyung Won Chung | OpenAI per his page; reported move to Meta | https://hwchung2.github.io | Talks and launch moments as the main evidence; lists cut off with "Show more" | Take: "Selected work" lists capped at three |
| 22 | Noam Brown | OpenAI research scientist | https://noambrown.com | A single page with a poker avatar | Skip: contrast case |
| 23 | Sam Altman | OpenAI CEO | https://blog.samaltman.com | A Posthaven blog with public upvote counts | Skip: popularity counts |
| 24 | Bill Peebles | OpenAI, head of Sora | https://wpeebles.com | A plain publication list | Skip: contrast case |
| 25 | Yang Song | Ex-OpenAI; Meta | https://yang-song.net | The al-folio academic theme with ctrl-k search | Skip: unmodified academic theme |
| 26 | Gabriel Goh | OpenAI researcher | https://gabgoh.github.io | An old homepage; his Distill article "Why Momentum Really Works" lets you drag settings that redraw the plots | Take: settings the reader adjusts to drive a plot |
| 27 | Leo Gao | OpenAI (affiliation not re-checked this session) | https://bmk.sh | Created and modified dates on every post | Take: both dates on notes |
| 28 | Richard Ngo | Ex-OpenAI governance | https://www.richardcngo.com | Google Sites; links his fiction | Skip: contrast case |
| 29 | Shyamal Anadkat | Ex-OpenAI applied AI | https://shyamal.me | The orderedlist theme, ⌘K search, a long bio of roles separated by slashes | Skip: slash-separated bios |
| 30 | Ed Bayes | OpenAI design staff | https://edbayes.com | Next.js with the Geist font; clean but anonymous | Skip: the 2025–26 default stack look |
| 31 | Zach Johnston | OpenAI design | https://zachjohnston.com | Work shown only as a row of company logos | Skip: logo rows |
| 32 | Dominik Kundel | OpenAI developer experience | https://dkundel.com | A photo on purple, a panda illustration, a contact list with emoji bullets | Skip: emoji bullets |
| 33 | SSI | Ilya Sutskever's company (he co-founded OpenAI) | https://ssi.inc | Near-plain text as a brand statement | Note: plainness works when the claim is big |
| 34 | Joey Flynn | OpenAI design (third-party source) | https://joeyflynn.com | An ASCII Breakout game whose bricks hide the navigation | Skip: the homepage as a game |
| 35 | Chester Cho | Founding designer at OpenAI | https://chestercho.com | His career told as a shared ChatGPT conversation | Skip: a chatbot transcript as a biography |

### C. Explorable explainers (29)

**What this lane taught:**
- They animate the system, not the site.
- The reader controls time.
- An architecture is explained by opening one more layer per step.
- Real numbers from a real system beat illustration.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Bartosz Ciechanowski | Independent | https://ciechanow.ski | Book-length essays with one-word titles; a live simulation under nearly every paragraph; demos pause when they scroll off-screen | Take: one-word titles (Loop, Stop, Ledger); speed sliders; the off-screen pause, which is both a performance trick and a calming one |
| 2 | Amelia Wattenberger | GitHub Next | https://wattenberger.com | Essays that are themselves interface prototypes ("Fish eye for text" shows focus and context at three levels); a "work in progress" label that links her 2019 site | Take: each system readable at three zoom levels (one line, one paragraph, full walkthrough) on keys 1–3; a "currently thinking about" list |
| 3 | Maggie Appleton | GitHub Next | https://maggieappleton.com | A digital garden with growth stages (seedling, budding, evergreen) and a Patterns library; she publicly redrew an AI-generated agent diagram she called unhelpful | Take: maturity labels (sketch → prototype → in production → retired); a patterns shelf; the line "drawn from the real code, by hand". Skip: a graph view |
| 4 | Jay Alammar | Author, *Hands-On Large Language Models* | https://jalammar.github.io | "The Illustrated X": the system starts as one black box, and each figure opens one more layer, with a fixed colour per kind of thing | Take: figure 1 is one box ("message in → answer out · time · cost"); each later figure opens one more layer |
| 5 | Sam Rose | ngrok developer educator | https://samwho.dev | Bottom-up simulations of infrastructure (load balancing, retries, queues) with pause, speed and reset controls, a "slow down" toggle and checklists of goals | Take: the method for your /lab: the same clicks drive two strategies side by side, with a free-play area at the end |
| 6 | Nicky Case | Independent | https://ncase.me | Warm, hand-drawn explainers with "Nutshell" links that expand inline | Take: inline expandable definitions for jargon (MCP, span, prompt caching). Skip: the games |
| 7 | Amit Patel | Red Blob Games | https://www.redblobgames.com | Diagrams you drag that update live, plus a public "making of" section | Take: a /making-of page, which also proves the diagrams were made by hand |
| 8 | Bret Victor | Dynamicland | https://worrydream.com | The "ladder of abstraction"; documents whose numbers react when you change them (his Tangle library); a "Promotional bio" next to a "Real bio" | Take: a telemetry ladder (one turn → its waterfall → many turns → a heatmap); adjustable numbers in sentences; two bios on /resume |
| 9 | Brendan Bycroft | Independent | https://bbycroft.net/llm | The whole GPT model as a 3D object with a guided camera tour | Take: the 2D version, one large SVG map that pans to each part. Skip: 3D |
| 10 | Polo Club (Georgia Tech) | Research group | https://poloclub.github.io/transformer-explainer | A real GPT-2 running in the browser | Take: widgets computed from your real configuration, not fake data |
| 11 | Lena Voita | Nebius Research | https://lena-voita.github.io | "Research Thinking" cards: the question first, the answer after you think | Take: decision cards that hide your choice until the reader guesses |
| 12 | Geoffrey Litt | Notion (formerly Ink & Switch) | https://www.geoffreylitt.com | "Enough AI copilots! We need AI HUDs"; essays alongside working prototypes | Take: observability as a quiet strip of numbers beside each step of a run |
| 13 | Linus Lee | Thrive Capital | https://thesephist.com | 100+ projects grouped by lifecycle (Released, Retired, Unfinished); a timestamped stream of short posts; a hand-drawn note on a real chart | Take: lifecycle groups; a stream; hand-drawn notes on real charts. Also appears in the AI-builders and CV lanes |
| 14 | Julia Evans | Independent (Wizard Zines) | https://jvns.ca | Hand-drawn zines plus sandboxes of real systems you can break | Take: a one-page zine, "How one tool call works"; a sandbox that replays recorded traces |
| 15 | Simon Willison | Independent (Datasette) | https://simonwillison.net | A public lab notebook; the same personal benchmark run on every new model; a GitHub README that updates itself | Take: your own recurring benchmark; a "recently shipped" block generated at build time |
| 16 | Distill | Journal, on hiatus since 2021 | https://distill.pub | A system of widths for text, wide figures and full-bleed figures; notes in the margin; citations on hover; the article "Communicating with Interactive Articles", the best overview of the genre | Take: the width system and margin notes for case studies. Skip: the Distill look |
| 17 | Thorsten Ball | Amp co-founder | https://thorstenball.com (post: ampcode.com/how-to-build-an-agent) | An agent built in under 400 lines, with each code snippet showing only what changed: "an LLM, a loop, and enough tokens" | Take: a code walkthrough that shows only the change at each step |
| 18 | Nick Tikhonov | Independent | https://www.ntik.me | A voice-agent build log with a running latency counter over real traces | Take: a time budget for one agent turn, with a ticking ms counter |
| 19 | Zakaria (@razakiau) | Independent | https://ccunpacked.dev | Claude Code's loop as an 11-step walkthrough you play at 0.5×, 1× or 2×, linked to the source (1,128 points on Hacker News) | Take: a step-by-step walkthrough of one request through your stack, 0.5× by default, pseudo-code only |
| 20 | Mike Bostock | Observable | https://bost.ocks.org/mike/algorithms | Every animation is paired with a static picture of the whole run | Take: a static waterfall under every replay; it doubles as the print and reduced-motion version |
| 21 | Kaspar Etter | Independent | https://explained-from-first-principles.com | "Recommended" and "optional" reading boxes; tool settings saved in the URL so they can be shared; a statement of how he used AI | Take: optional reading folds; shareable widget settings; a short AI-use note |
| 22 | Horace He | His page still says PyTorch at Meta | https://horace.io | One metaphor carried through a whole essay (compute as a factory) | Take: one true metaphor of your own, carried through. Skip: "MCP is USB-C for AI" |
| 23 | Simon Boehm | Anthropic, unconfirmed | https://siboehm.com | A numbered work log (from 1.3% to 93.7% of cuBLAS speed) with hand-drawn diagrams and the failed attempts kept in | Take: a version-by-version ladder with measured numbers, failures included |
| 24 | kipply | Unconfirmed | https://kipp.ly | Back-of-the-envelope maths from first principles, with worked numbers and exercises | Take: back-of-the-envelope maths boxes with numbers the reader can change |
| 25 | Damar | Independent | https://visualrambling.space | Short "Sketches" kept apart from long "Stories"; stories move forward only when you tap the right edge | Take: the sketch/story split; stories that advance on click |
| 26 | IDEA (Sándor Fekete, blinry) | Project | https://idea-instructions.com | Wordless, IKEA-style instruction posters for algorithms | Take: one wordless poster, "Assembling a tool call" |
| 27 | Gwern Branwen | Independent | https://gwern.net | Every page states its status, confidence and importance; links open as previews that can nest | Take: a status and confidence line on each case study |
| 28 | Andy Matuschak | Independent | https://notes.andymatuschak.org | Working notes kept in public ("with the garage door up"), opening side by side in stacked panes; no index | Take: linked notes that open side by side |
| 29 | Maarten Grootendorst | Author (newsletter) | https://newsletter.maartengrootendorst.com | "A Visual Guide to LLM Agents": 60+ visuals that build on each other | Take: the bar for a consistent set of figures. Skip: a generic agent taxonomy presented as "your architecture" |

### D. Design engineers (34)

**What this lane taught:**
- Respond to input fast.
- Reveal content slowly, and only once.
- Let background layers finish and then stop.
- The homepage is a document, not a show.
- A dated index of small experiments is the proof of work.
- Being readable by AI agents is 2026's new colophon.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Rauno Freiberg | Vercel; Devouring Details | https://rauno.me | A homepage of about 30 words above a dense /craft archive of 70+ dated entries, each labelled by type; a manifesto written as imperatives; old versions of the site still live | Take: a dated, typed workbench; imperatives of your own (not his wording); a finished view and a taken-apart view for each system |
| 2 | Emil Kowalski | Linear | https://emilkowal.ski | Essays where you feel each claim: keys flip a demo between two versions, another key slows it down; "You Don't Need Animations" sets out timing rules | Take: before/after toggles in architecture essays, on keys of your own; his timing rules. Skip: his exact J/K/S keys |
| 3 | Josh W. Comeau | Educator | https://www.joshwcomeau.com | Delight treated as a discipline: likes capped per visitor, a rainbow every visitor shares, strict rules for sound, spring easing in plain CSS, page transitions | Take: sound off by default; at most one shared detail; CSS-only springs. Skip: the amount of whimsy |
| 4 | Paco Coursey | Linear (made cmdk) | https://paco.me | Radical restraint: the site works without JavaScript; a small /craft page in three groups | Take: every page readable without JS; a small lab |
| 5 | Shu Ding | Vercel (v0, SWR, Satori) | https://shud.in | "Metaphors": numbered sections that reason across fields; projects written as prose that states his exact role | Take: an essay, "Metaphors I build agents with"; project write-ups that state your role |
| 6 | Nanda Syahrasyad | Independent | https://www.nan.fyi | "Build your own database": the reader operates the system; a play button with a "0 / 7" step counter | Take: a multi-panel "follow one tool call" with buttons that inject faults |
| 7 | Flora Guo | Design (joining Ramp; formerly Vercel) | https://www.floguo.com | ASCII flowers at 15% opacity that grow once and stop; a version number (v3.8.0) with a changelog and colophon | Take: a faint ASCII layer drawn from your own domain that grows once; version numbers and a changelog. Skip: her dictionary-entry headline |
| 8 | Anthony Fu | Vercel / Nuxt | https://antfu.me | Generated plum branches that grow in from the page edges and stop on their own; content slides in over 1 s, 90 ms apart | Take: a background call graph that grows once and rests; the same staggered entrance. Skip: the plum-branch shapes |
| 9 | Brian Lovin | Notion | https://brianlovin.com | The site as a small OS of personal tools; `llms.txt` plus Markdown copies of pages; writing about agents that leads with numbers | Take: the Markdown layer; a /stack page with opinions; notes that lead with measurements |
| 10 | Benji Taylor | Design at X and SpaceXAI | https://benji.org | "Updated <date>" and his local time; Liveline, a live chart whose values ease toward each new reading and whose flat line "breathes" before data arrives | Take: live numbers that ease into place; idle states that breathe; an honest post about what coding agents got wrong |
| 11 | Karri Saarinen | Linear co-founder | https://karrisaarinen.com | 16 one-line "Notes on building" placed before 16 years of essays | Take: "Notes on building agents", each line expanding to the decision behind it |
| 12 | Jakub Krehel | Interfere | https://jakub.kr | A checklist of interface details (an 800 ms staged entrance, three-layer shadows, digits of equal width) published as installable agent skills | Take: those values as base design tokens; publish your own rules as a skill |
| 13 | Raphael Salaja | Warp | https://www.raphaelsalaja.com | Animation principles, each with a live demo; a library that mixes fashion notes with interface writing | Take: rolling digits for before → after numbers; one non-tech interest in the open |
| 14 | Arthur Monnet | Product designer, Montréal | https://arthurmonnet.com | A real, read-only `/mcp` endpoint with 8 tools; "This site is agent-readable" in the footer | Take: a read-only /mcp, built the way you build your production servers. Skip: his "Portfolio CLI" apps |
| 15 | Delba de Oliveira | Formerly Vercel docs | https://delba.dev | One reusable diagram system, plus explainer videos generated from code (Remotion) | Take: one diagram vocabulary for every system |
| 16 | Ahmad Shadeed | Independent | https://ishadeed.com | Articles as instruments: step-through controls, drag handles, live state labels, recorded video where a browser lacks support | Take: live state labels inside demos (for example "result: 7,912 / 8,000 chars") |
| 17 | Chase McCoy | Anthropic, design systems for Claude | https://chsmc.org | A weblog with a blogroll; Source Serif with Brunswick Grotesque; experiments live on a separate site | Take: a blogroll; experiments kept on a separate path |
| 18 | Josh Puckett | Iteration | https://joshpuckett.me | DialKit, a floating panel of live settings | Take: a settings panel on architecture demos |
| 19 | Paul Stamatiou | Sesame | https://paulstamatiou.com | "Handcrafted by Stammy"; the footer says the site has run for 21.08 years | Take: a footer status line built from real build data |
| 20 | Rasmus Andersson | Made the Inter typeface | https://rsms.me | Small measuring tools (a pointer-latency playground); a 1998 version of his site kept online | Take: measuring instruments instead of games; keep an old version online |
| 21 | Lochie Axon | Family / Aave | https://lochie.me | WebHaptics, a library of vibration patterns for the web | Skip for now: use haptics only if tied to specific moments and switched off with reduced motion |
| 22 | Adam Argyle | Not stated | https://nerdy.dev | One feed with filters by type; page transitions added to an existing blog | Take: type filters on one feed (note · essay · diagram · talk) |
| 23 | Maxime Heckel | Not stated | https://blog.maximeheckel.com | Shader essays with playgrounds; a Glossary; an "Ask" AI search | Take: a glossary. Skip: "Ask" |
| 24 | Gavin Nelson | OpenAI designer | https://nelson.co | Shipped work as a list stamped by year | Take: let a dated list carry the confidence |
| 25 | Jhey Tompkins | Shopify | https://jhey.dev | "Wait, how did you do that?"; an ask-me-anything run through GitHub | Take: an ask-me-anything in GitHub Discussions |
| 26 | Samuel Kraft | Raycast | https://samuelkraft.com | Clean project cards | Lesson: clean but forgettable |
| 27 | Mariana Castilho | Profound | https://www.mrncst.computer | One unusual display face plus a monospace | Take: let JRK Hand and JRK Mono carry the identity |
| 28 | Lee Robinson | ML at SpaceX (formerly Cursor, Vercel) | https://leerob.com | His whole CV in one sentence | Take: a one-sentence CV on the home page |
| 29 | Guillermo Rauch | Vercel | https://rauchg.com | An essay list with large, unlabelled numbers | Lesson: one great essay outlasts any design; never show a number without a label |
| 30 | Cassie Evans | Site retired | https://www.cassie.codes | A farewell page: maintaining the site "no longer nourishes me" | Lesson: keep delight cheap to maintain |
| 31 | Pedro Duarte | Not stated | https://ped.ro | Verified; low signal for this brief | Nothing to take |
| 32 | Steve Ruiz | Not stated | https://www.steveruiz.me | Verified; low signal for this brief | Nothing to take |
| 33 | Daniel Eden | Figma | https://daneden.me | A year-by-year timeline of apps, 2011–2026 | Minor pattern |
| 34 | Tony Seets | Not stated | https://tonyseets.com | A dated colophon entry that maps vibration patterns to interface moments | Take: dated colophon entries, one per change |

### E. Creative and award-winning portfolios (25)

**What this lane taught:**
- Versions as identity.
- Two views of one index.
- Motion done mostly in CSS.
- Award winners often score low on accessibility.
- The "award-site look" is now a tutorial catalogue, which is why it reads as template.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Lynn Fisher | Independent (formerly Netlify) | https://lynnandtonic.com | Redesigned every year since 2007 ("v. XIX"); every version archived with a write-up; one physical surprise a year (in 2025 the column stretches as you resize the window); about 1.6 KB of JavaScript | Take: the version as a feature ("v. III", an archive, a changelog); one physical surprise tied to your own material. Skip: the stretching column and the paperback-book concept, which are hers. Also appears in the design-engineers lane |
| 2 | Tim Holman | Goldman Sachs | https://tholman.com | A canvas of drifting lines of text; an "Order" button animates the same items into tidy rows; a hidden plain-HTML menu for screen readers | Take: a Thinking ⇄ Structure toggle on your notes, with a real list underneath. Skip: the neon look and mirrored name |
| 3 | Cyd Stumpel | Freelance; lecturer | https://cydstumpel.nl | Almost all motion is native CSS: page transitions choreographed for each pair of pages; reveals triggered by scrolling | Take: a named transition for each kind of navigation; titles that carry over between pages; an "Available <month>" status line |
| 4 | Aristide Benoist | Independent | https://aristidebenoist.com | No libraries, about 67 KB of JavaScript, raw WebGL; keyboard navigation; he refuses scroll-jacking | Take: a byte budget in the colophon; colours for each case study derived from its data; j/k keys to move through work |
| 5 | Jesper Landberg | Independent | https://jesperlandberg.com | A WebGL site that machines can fully read: every URL returns Markdown on request; `llms.txt` with a "Not the right referral for" section | Take: an llms.txt that says when to refer you and when not to; a plain full index. Skip: the wall of award counts |
| 6 | darkroom.engineering | Studio (maintains Lenis) | https://darkroom.engineering | The studio site doubles as a developer resource: a read-only content API and guidance for agents | Take: one animation loop driving Lenis, Motion and any canvas; gentle Lenis settings |
| 7 | Antoine Wodniack | Freelance | https://wodniack.dev | Personal archaeology: photos of his desks over the years, his old portfolios, serial numbers on work | Take: an archaeology strip (desks, first commit, v1 and v2) |
| 8 | Joffrey Spitzer | Freelance | https://joffreyspitzer.com | Restraint as the stated concept; a Grid ⇄ List toggle where the items visibly travel between layouts | Take: a List ⇄ System-map toggle on /work. Skip: the loading counter |
| 9 | Corentin Bernadou | Freelance | https://www.corentinbernadou.com | The portfolio framed as a publication: "Issue N°003", reference codes | Take: RFC / ADR numbers on case studies (decorative metadata that is also real information) |
| 10 | Jonas Reymondin | Freelance | https://jonasreymondin.com | "Folio:06": the version number rolls into place as the identity | Take: a small version counter that links to /changelog |
| 11 | Pacôme Pertant | Motion and sound designer (site by Louis Bocquet) | https://pacomepertant.com | Work shown as a spiral or as a list; a sound choice before you can enter | Take: an expressive view is fine only if the plain list always exists. Skip: the sound gate |
| 12 | Bruno Simon | Three.js Journey | https://bruno-simon.com | A world you drive through; "Whispers" (30 messages of 30 characters each); his README publishes the render loop as ordered stages; day and season cycles | Take: day and season cycles tied to IST; your agent loop drawn as numbered stages. Skip: the car, the game, the 3D |
| 13 | Henry Heffernan | Software engineer | https://henryheffernan.com | A 3D desk whose monitor runs a real web OS; the embedded page reports every input back to the outer page | Take: the bridge idea: a replayed trace reports each event to the diagram, and each node warms to kesari as the request passes. Skip: the 3D and the OS |
| 14 | Dennis Snellenberg | Freelance (Osmo) | https://dennissnellenberg.com | The most-copied creative portfolio: a "Hello" loader in many languages, buttons that pull toward the cursor, a "View" bubble that follows it | Skip all of it. Lesson: effects unrelated to the content become a template |
| 15 | Robin Noguier | Interactive designer (built by Lorenzo Cadamuro) | https://robin-noguier.com | WebGL distortion over real HTML images; a cheeky, confident voice | Take: one line of confident humour. Skip: distortion carousels |
| 16 | Patrick Heng | Creative developer | https://patrickheng.com | Letters on physics springs; text that talks back as you scroll; built-in debug panels | Take: a heavy, slow spring on your name, once; a `?debug` overlay. Skip: arcade-style WebGL |
| 17 | Olivier Larose | Independent | https://olivierlarose.com | A tutorial catalogue of every common award-site effect | Use it as the list of things to avoid |
| 18 | Andrew Woan (Mr. Panda) | Not stated | https://www.mr-pandas-psychologically-safe-portfolio.com | A papercraft portfolio that argues a point | Take: a plainly stated stance; hand-drawn margin notes with a slight, low-frame-rate wobble. Skip: the childlike style |
| 19 | Wildy Riftian | Built by Surd Studio | https://www.wildyriftian.com | An archive metaphor: folders, keychains, cards that flip | Take: case studies as index cards with one status stamp. Skip: using every motif at once |
| 20 | Grégory Lallé | Not stated | https://gregorylalle.com | Rolling-digit indices; navigation words doubled so they roll on hover | Skip: roll-on-hover |
| 21 | Artiom Yakushev | Not stated | https://www.art-yakushev.com | Animated text splitting and scrambling; a live local clock | Skip: text scrambles and decorative clocks |
| 22 | bleibtgleich'26 | Not stated | https://bleibtgleich.dev | A heavy animation stack plus chat beside other visitors' cursors | Skip: cursor chat |
| 23 | Meer Mohsin | Not stated | https://www.meermohsin.me | "Click anywhere to activate the experience", a 000 loader, placeholder "lorem ipsum" left in | A specimen of the clichés |
| 24 | Léo Parpeix | Art director | https://www.leoparpeix.com | "Portfolio 2026", built with Vite and Vue | Minor |
| 25 | Elliott Mangham | Not stated | https://elliott.mangham.dev | An expandable "Credentials" panel that includes his average project costs | Take: an honest details panel (for you, a "My part" panel) |

### F. Indian developers (42)

**What this lane taught:**
- The best sites put writing first, present work as lists, and have one signature device.
- The AI engineers here show their thinking through explanations you can step through, not chatbots.
- Local identity is rare:
  - In a survey of 102 IndieWebClub Bangalore homepages, only 3 show any Indic script.
  - At most 1 shows a time-zone marker such as IST, and even that may be a false positive.
  - 84 link an RSS feed, 46 are on a webring and 13 have a /now page.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Aayush Agarwal | Developer | https://aayush.cv | A monochrome index set in Inter; the name blurs in letter by letter; clicks and ticks synthesized with Web Audio, with no audio files; hidden pages opened by G-key sequences, including a /usage ledger of AI tokens | Take: the craft (the easing curve, the soft blur at the page edges, an honest usage ledger, a key map of your own). Skip: the look, or v3 reads as a copy. Don't name him on the site without his OK |
| 2 | Tejas Kumar | IBM, Berlin | https://tej.as | His life as a testimony in chapters, filterable by thread; a /status page his own app rewrites; a bead slides down a red line in the margin as you read | Take: "follow one thread" through your work; a /bench page your own pipeline rewrites; a bead that travels your diagram |
| 3 | Dhravya Shah | Founder of Supermemory | https://dhravya.dev | A bio where every line links to its proof; "Same conversation, two windows", a side-by-side step-through, plus a cost × latency scatter plot | Take: a bio with receipts; side-by-side replays from recorded traces |
| 4 | Arpit Bhayani | Razorpay | https://arpitbhayani.me | A counted archive; 673 notes titled as claims; a public roadmap with honest `[todo]` markers | Take: notes titled as claims; an honest todo roadmap. Skip: follower counts |
| 5 | Atharva Raykar | Bangalore, formerly nilenso | https://atharvaraykar.com | The homepage is four lists (Present, Past, Reading, Contact); an essay that goes formula → each term explained → a simulator | Take: a Present / Past block; the formula-then-simulator pattern |
| 6 | Abhinav Tushar | Bengaluru, conversational AI | https://lepisma.xyz | Writing split into blog / journal / log / wiki; an essay, "Embracing Slow LLM Workflows" | Take: a terse dated /log; slowness as a stated value |
| 7 | S Anand | Straive; IIT Madras | https://www.s-anand.net | A public-domain archive since 1999 built for both humans and agents (llms.txt, a full-text corpus file, a schema); a "Mistakes I made" page | Take: a corpus file of your notes; an index of postmortems |
| 8 | Kailash Nadh | CTO, Zerodha | https://nadh.in | A site online since 2001; an automatically generated /releases table; photo captions that give only the place | Take: a /releases ledger from your public tags; captions like "Noida, UP" |
| 9 | Ansub Khan | Agno, front-end lead | https://ansubkhan.com | A Renaissance-notebook homepage ("fol. i", "fig. 1", a colophon); a famous painting used as a clickable sitemap | Take: a numbered plate-and-figure system; the architecture diagram as navigation. Skip: the old-manuscript costume. Note: one of his outbound links now redirects to spam |
| 10 | Hiran Venugopalan | Product designer | https://hiran.in | One "Everything" stream with a card design for each type of content; light and dark themes named "chalk" and "ink"; a Malayalam typeface | Take: each content type as an object (trace cards with span bars); themes with names |
| 11 | Thejesh GN | DataMeet | https://thejeshgn.com | His name in Latin script paired with Kannada; weekly notes | Take: जयेश as a quiet second voice |
| 12 | Vikas Raj Yadav | Product designer | https://vry.works | Recreations of Indian consumer apps in Rive, an animation tool | Take: one Rive animation if a diagram needs distinct states. Skip: the "ASK TI" chat widget and the terminal-style headline |
| 13 | Manu Arora | Aceternity UI | https://www.manuarora.in | A restrained personal site with an Inspiration page naming the people he learned from | Take: a credits and influences page |
| 14 | Varun Vachhar | Chromatic / Storybook | https://varun.ca | Generated geometry with looping motion | Take: at most one slow loop generated from real data, paused off-screen. Note: no posts since 2023 |
| 15 | Abhay Rana (Nemo) | Fintech, Berlin | https://captnemo.in | A tiny page of specific, true, local lines ("I don't have an Aadhaar"); a dated /now | Take: one specific local line that is true of you; a dated /now |
| 16 | Sayak Paul | Hugging Face | https://sayak.dev | His name in Bengali script in the greeting; a public FAQ; a credit for where the site's structure came from | Take: your name in Devanagari; an FAQ for recruiters |
| 17 | Paras Chopra | Lossfunk | https://invertedpassion.com | "Welcome, friend", with clear starting points (Start here, his notes garden, his book) | Take: "Start here" paths by type of visitor |
| 18 | Ankur Sethi | Independent; co-runs IndieWebClub Bangalore | https://ankursethi.com | A "Lab Notebook"; a post about retyping LLM-generated code by hand | Take: the notebook framing |
| 19 | Siddharth Kshetrapal | GitHub design systems | https://www.sid.st | NOW and PAST, a word each | Take: the compression |
| 20 | Nirant Kasliwal | Not stated | https://nirantk.com | "Endorsed Friends", where both people opt in | Maybe later |
| 21 | Harsh Shandilya | Cloudflare | https://msfjarvis.dev | Weekly notes, /uses, /now, Pagefind search | Take: Pagefind for static search |
| 22 | Divjot Singh | Front-end engineer | https://bogas04.fyi | A one-line identity | Minor |
| 23 | xypnox | Not stated | https://www.xypnox.com | "The content is 100% human generated" in the footer | Take the gesture in a form that is true for you: an exact /ai page |
| 24 | Akhil Unnikrishnan | Not stated | https://akhilunnikrishnan.com | A theme picker; a site "intended for an audience of zero" | Minor |
| 25 | Sid Verma | Not stated | https://sidverma.io | "Please leave your shoes at the door" | Take: a specific, welcoming voice |
| 26 | Akash Bhat | Not stated | https://akashbhat.com | "chasing new dosas … all over Bangalore" | Take: a specific local line |
| 27 | Ankit Gadiya | Not stated | https://ankit.earth | A small-town origin; Dangerous Dave on Windows 98 | Take: one origin detail |
| 28 | Adithya Nair | Not stated | https://adithyanair.com | A status sidebar (blogging since, last updated, location) | Minor |
| 29 | George Supreeth | Not stated | https://georgesupreeth.com | "Drawing is thinking"; Goudy with drop caps | Take: the sketchbook framing |
| 30 | Nikshep | Not stated | https://nikshep.handwritten.blog | Pages that are literally handwritten | Take: one handwritten page (see idea 14, the zine) |
| 31 | aspizu | Not stated | https://aspiz.uk | An ASCII header, a pixel font, weekly notes | Note: use ASCII only when it carries information |
| 32 | Jatan | Not stated | https://journal.jatan.space | A Hindi poem shown as transliteration, then Devanagari, then a translation; "a slow thinker" | Take: that three-layer bilingual pattern |
| 33 | Yash Garg | Not stated | https://yashgarg.dev | ⌘K, Literata with Maple Mono, a homelab section | Minor |
| 34 | Piyush Garg | Not stated | https://www.piyushgarg.dev | A combined heatmap of GitHub and YouTube activity; a guestbook | Skip: a heatmap as the headline |
| 35 | Kaustubh M. | Not stated | https://kaustubh.page | Chess, microblog and now pages | Minor |
| 36 | Kartik Kwatra | Not stated | https://kartikkwatra.com | "Thoughts on Data"; Newsreader with Inter | Note: Newsreader is very common in 2026 |
| 37 | Akash Bhadange | Peerlist co-founder | https://akashbhadange.com | A Peerlist profile as the homepage ("Id Verified", "#1 of the Week") | Take: keep a Peerlist profile that points at your site. Skip: a platform as your main home. Also appears in the CV lane |
| 38 | Yogini Bende | Peerlist co-founder | https://yogini.dev | A profile page rendered by Peerlist | Same as above |
| 39 | Hitesh Choudhary | Not stated | https://hiteshchoudhary.com | The whole site is a VS Code clone | Skip: code-editor skins |
| 40 | Akshay Saini | Not stated | https://akshaysaini.in | Vanity counters ("lines of code", "pixels rendered") | Skip |
| 41 | Anurag Hazra | Not stated | https://anuraghazra.dev | A headline made of a code block (`class Person {…}`) | Skip |
| 42 | Sunil Pai | Agents at Cloudflare (Indian origin not stated on his site; kept for the note) | https://sunilpai.dev | Warm paper (`#f8f6f0`), Roboto Mono, Pagefind | Note: warm paper is everywhere |

### G. AI builders at other labs and startups (31)

**What this lane taught:**
- The writing is the portfolio.
- Credibility comes from:
  - a specific number with a condition attached;
  - precise credit for which part was yours;
  - one fixed format for describing each system.
- Honest status labels and authorship notes show that a person keeps the site up.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Sebastian Raschka | Independent researcher, author | https://sebastianraschka.com | LLM Architecture Gallery: 109 models, each on the same spec card; a "Compare two models" view; a Changes page | Take: a /systems gallery with one spec card per system, plus a Compare view across versions. This is the strongest structural idea in the lane |
| 2 | Hamel Husain | Parlance Labs; teaches an AI evals course | https://hamel.dev | Evals organise the whole site; a three-level evaluation ladder illustrated with real traces and tables of test assertions | Take: a ladder of tests and evals for each system, filled with your real numbers. Skip: the promo banner |
| 3 | Eugene Yan | Anthropic, technical staff | https://eugeneyan.com | A site counter (posts, talks, words); a Start Here page organised by type of reader; role lines in the form `years: role @ org (focus)`; results shown as deltas in brackets | Take: counters computed when the site builds; Start Here; that line format for /resume. Also appears in the CV lane |
| 4 | Chip Huyen | Writer; author of *AI Engineering* | https://huyenchip.com | A warm, first-person homepage; "List 100", a life list scored "40.75/92" with partial credit; her GenAI-platform post adds one box to the diagram per step | Take: "my stack in six steps"; a ✓ / ✗ / ~ ledger; a page in Hindi, as she offers one in Vietnamese. Also appears in the explorables lane |
| 5 | swyx | Latent Space; AI Engineer | https://www.swyx.io | A "notebook" with sections numbered § 01 to § 11 and printer's ornaments; an /ideas library of 630 entries; GitHub Issues used to write posts; old bios kept, with dates | Take: § numbering and one ornament; "N starting points"; dated old bios. Note: his llms.txt shipped with the word `undefined` in it |
| 6 | Shreya Shankar | Researcher (DocETL); joining CMU | https://www.sh-reya.com | Lists of the people she mentored and where they went next; a visible note to AI agents; she publishes material others keep private | Take: a polite, visible note to agents; publish one thing others hide (your decision-record template) |
| 7 | Omar Khattab | MIT (DSPy, ColBERT) | https://omarkhattab.com | Precise credit on each paper ("Contributions: directed the IR evaluation"); a "Last Update" date | Take: a "My part" line on every case study |
| 8 | Sander Dieleman | Google DeepMind | https://sander.ai | Each method tagged with emoji "ingredients"; "the prose is entirely artisanal intelligence" | Take: a legend of your recurring mechanisms, drawn as typographic glyphs rather than emoji; a one-line authorship note |
| 9 | Alexander Mordvintsev | Google (inferred) | https://znah.net | "I visualize things to understand how they work"; every idea ships as a live toy | Take: 2–3 instruments that behave the same every run and make no LLM calls |
| 10 | Victor Mustar | Hugging Face, head of product | https://victor-victor-mustar-personal-website-5y2n3.static.hf.space/index.html | "Now" items tagged by how often they happen; a numbered career path; numbered beliefs | Take: "Now" items tagged by frequency; numbered beliefs linked to decisions. Skip: the blinking terminal cursor |
| 11 | Kanjun Qiu | Imbue | https://kanjun.me | Open questions described as "mostly pointers"; a section named with a pun on her name ("Kanjectures") | Take: an open-questions list; one section name only you could have |
| 12 | Matt Webb | Inanimate | https://interconnected.org/home | "New posts for 340 consecutive weeks"; an "On this day" archive; timestamps to the minute | Take: an "On this day" strip; IST timestamps to the minute; a streak only if you can keep it up |
| 13 | Eric Zhang | Thinking Machines | https://www.ekzhang.com | Every project carries one measured number with its condition ("72.3% mIoU at 37.3 FPS") | Take: numbers with their conditions; sort work by date or by impact |
| 14 | Thomas Wolf | Hugging Face, chief science officer | https://thomwolf.io | One hand-written static page telling a winding life story (physics, then patent law, then machine learning) | Take: your path told as a short paragraph; "* * *" section breaks |
| 15 | Vicki Boykis | Founding ML engineer at a startup | https://vickiboykis.com | A changelog for the site itself and a page stating her AI policy | Take: /changes and /ai |
| 16 | Answer.AI | AI lab | https://www.answer.ai | Every page links its Markdown version; an llms.txt (the lab's founder proposed the format) | Take: Markdown copies of every page, linked from each page's header |
| 17 | Alex Komoroske | Common Tools | https://komoroske.com | A knowledge garden of cards; an old version of the site kept online ("Blast from the past") | Take: v1 and v2 kept online, each with a note on what you believed then |
| 18 | Yohei Nakajima | Untapped Capital; made BabyAGI | https://yoheinakajima.com | "VC by Day, Builder by Night"; his family crest as the site's seal | Take: your JRK monogram as a seal at the end of pages. Skip: the "chat with our GPT associate" box |
| 19 | Nathan Lambert | Trillium Labs | https://www.natolambert.com | Guides written from his own practice; links to live dashboards | Take: guides such as "How I review an agent trace" |
| 20 | Jonathan Whitaker | Not stated | https://johnowhitaker.dev | A feed of everything plus lab notes; hidden text that tells AI readers to answer in a pirate voice | Skip: hidden instructions aimed at AI |
| 21 | Sasha Rush | Cursor | https://rush-nlp.com | An identity line of three short fragments | Take: the compression |
| 22 | Erik Bernhardsson | Founder of Modal | https://erikbern.com | Essays built on statistics; a "roughly monthly" posting promise | Minor |
| 23 | Drew Breunig | Cmpnd; DSPy | https://www.dbreunig.com | Edits a handbook on context engineering | Minor |
| 24 | Hrishi Olickel | Southbridge | https://olickel.com | A section called "the ones the internet likes"; ages shown as decimals ("1.4 days ago") | Minor |
| 25 | Christopher Fleetwood | Affiliation not confirmed | https://fleetwood.dev | A pointing-hand symbol (☞) marks favourite essays; an anonymous feedback form | Take: one typographic mark for favourites |
| 26 | Jonathon Belotti | Modal | https://thundergolfer.com | A page listing his physical books; a three-line motto | Minor |
| 27 | Jim Fan | NVIDIA | https://jimfan.me | The Wowchemy academic template | Skip |
| 28 | Yi Tay | Google DeepMind | https://www.yitay.net | A Squarespace grid of thumbnails with "Read More" | Skip |
| 29 | Philipp Schmid | Not stated | https://www.philschmid.de | ⌘K search; an archive by month | Minor |
| 30 | Charles Frye | Not stated | https://charlesfrye.github.io | "Tangent Space", on GitHub Pages | Minor |
| 31 | Lance Martin | Not stated | https://rlancemartin.github.io | "Resurrecting an old blog" | Minor |

### H. CV and résumé formats (16)

**What this lane taught:**
- The CV shrinks to one sentence on the home page and expands on /resume.
- Rows start with the date.
- A sentence about each era comes before any bullets.
- Print gets its own edit.
- One source of data feeds every format: HTML, PDF, JSON and Markdown.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Brittany Chiang | Klaviyo | https://brittanychiang.com | A short CV on the page, with a full /archive table and the PDF one click away; the most-cloned developer layout | Take: how the information is organised. Skip: every visual (the pinned left column, the spotlight that follows the cursor, the list that dims on hover) |
| 2 | Bartosz Jarocki | Not stated | https://cv.jarocki.me | One typed data file; very thorough print styles; structured data telling search engines when the page last changed; a command menu | Take: the print discipline and the structured data. Skip: tag pills and a command menu on a CV |
| 3 | Fabrice Bellard | Independent | https://bellard.org | About 40 one-line descriptions of things he built, and a single "last update" date | Take: a "Things I've built" list, one short phrase each |
| 4 | Nat Friedman | Not stated | https://nat.org | "Some things about me" and "Some things I believe" | Take: beliefs condensed from your rules |
| 5 | Ines Montani | Explosion | https://ines.io | Talks listed as rows: date · type · event · city · small icon links | Take: the same row format for notes and releases |
| 6 | Jamie Tanna | Lead, Mend Renovate | https://hire.jvt.me | "What I'm looking for in my next role"; résumé markup that machines can parse (the h-resume microformat); a separate, shorter print version | Take: all three |
| 7 | Max Böck | Template author | https://github.com/maxboeck/resume | A self-contained, accessible résumé template with machine-readable markup | Take: /resume loads nothing from other servers; a "Last updated · view source" footer |
| 8 | JSON Resume (Thomas Davis) | Open schema | https://jsonresume.org | One data schema, rendered in many themes | Take: add `meta.lastModified` and `meta.version` (v3 already exports this format) |
| 9 | RenderCV | Open-source tool | https://github.com/rendercv/rendercv | The CV written as checked YAML and rendered to PDF | Take: check that claims are true, not just well-formed (a content test that fails when a number has no source) |
| 10 | Jake's Resume and Typst basic-resume | Templates | https://github.com/jakegut/resume | The standard LaTeX résumé for CS students; reads well in applicant-tracking systems | Take: keep the PDF plain so tracking systems can read it. Skip: a web CV that looks like it |
| 11 | Awesome-CV | Template | https://github.com/posquit0/Awesome-CV | A coloured header and a row of icons; versions of it advertise hidden prompts aimed at AI screening tools | Skip |
| 12 | Ben Friedland | Not stated | https://github.com/ben174/bugben | A résumé kept as a git repository: jobs are folders and leaving a job is a commit | Take: a "How I got here" strip styled as a one-line-per-commit git log of public milestones |
| 13 | Justin Garrison | Not stated | https://justingarrison.com/blog/2023-10-20-how-i-track-my-resume-with-git/ | A branch of his résumé for each role he applied to, kept for 10 years | Take: "read as" views for different readers; a visible history |
| 14 | Tiger Oakes | Not stated | https://tigeroakes.com/posts/resume-editor | The on-screen page sized in physical units, so the screen matches the paper | Take: an A4 sheet sized 210 × 297 mm |
| 15 | Jeff Huang | Not stated | https://jeffhuang.com/designed_to_last/ | "This Page is Designed to Last": old versions kept as dated files; nothing loaded from other sites | Take: dated snapshot URLs |
| 16 | Will Larson | Not stated | https://lethain.com/r-i-p-your-resume-site-to-awesome/ | A 2008 résumé where focusing on a skill highlights the roles that used it | Take: a calm highlight linking each skill to the bullets that used it |

### I. Trends 2025–26 (10)

**What this lane taught:**
- The "Claude aesthetic" got a name.
- Sites now mark editions instead of being redesigned from scratch.
- Builders design what AI agents see on purpose.
- Visitors can share presence without chat.
- The personal web is having a revival, and part of it is explicitly anti-AI.

| # | Person | Affiliation | URL | Signature idea | Borrowed, or why not |
|---|---|---|---|---|---|
| 1 | Henry Desroches | Independent | https://henry.codes | The homepage as a dated zine issue ("ver. ss25") with a letter from the editor; his essay "A Website To Destroy All Websites" rallied the personal-web revival | Take: an edition named after the season and a one-line editor's note. Skip: the gothic persona and the weather widget |
| 2 | Salma Alam-Naylor | Not stated | https://whitep4nth3r.com | The whole 2026 redesign was derived from one personal photo; a page written for language models | Take: derive the texture from one real object of yours; a /for-agents page |
| 3 | Naz Hamid | Not stated | https://nazhamid.com | Left beige, terracotta and serif because AI tools had made the look generic; moved to indigo, blueprint and selvedge denim | Take: his reasoning ("what's new to me is what's true to me") and a shift toward neel |
| 4 | Elliott Cost | Not stated | https://everything.elliott.computer | Every project numbered (the latest is #179); he co-makes the printed Internet Phone Book | Take: № numbering; submit v3 to the Internet Phone Book |
| 5 | Spencer Chang | Not stated | https://spencer.place | playhtml: page elements whose state every visitor shares and that persists ("change the lights, leave a note") | Take: one shared, slow object (a lamp). Skip: emoji navigation |
| 6 | Robb Knight | Not stated | https://rknight.me | Runs slashpages.net, a catalogue of conventional pages like /now and /uses; a webring; his server sent an AI agent's request to a 10 GB file | Take: /ai, /changelog and /why pages, with an index of them in the footer. Skip: hostility to bots |
| 7 | Christopher Kirk-Nielsen | Not stated | https://chriskirknielsen.com | A tiny "no A.I." mark in the footer, meant to be "as unremarkable as ©" | Take it in a form that is true for you: "AI-assisted, human-decided", linking to /ai |
| 8 | Damola Morenikeji | Not stated | https://www.bydamo.la/p/ai-manifesto | Started the /ai page convention | Take: the structure for your /ai page |
| 9 | Ryo Lu | Cursor, head of design | https://os.ryo.lu | ryOS: a web operating system with about 30 apps and an AI assistant (the page runs only in JavaScript, so its README was read instead) | Skip: the model for every OS-plus-chat-plus-games portfolio |
| 10 | ertdfgcvb | Design and code studio, Lugano | https://play.ertdfgcvb.xyz | ASCII as a programmable medium | Reference for ASCII that carries meaning |

---

## 3. What makes a site feel authored rather than AI-generated

Generic quality is cheap now, so effort no longer signals that a person made the site. Specificity does. On Hacker News in Sep–Oct 2026, "Opus 5.5 is good at explainer videos" got 433 points. Warm-paper portfolio templates already ship on GitHub ("Paperfolio") and Lovable. Twelve observations follow.

1. **It can be traced to one real thing.**
   - Felix Rieseberg's site is his Berlin desk on a rainy night.
   - Salma Alam-Naylor's palette comes from one photo of her on stage.
   - Naz Hamid's blues come from indigo dye and selvedge denim.
   - Alex Albert's bio is about the orchards he grew up in.
   - Nemo writes "I don't have an Aadhaar".

   A generated site traces back to a prompt ("minimal, warm, editorial"). The test: could your headline sit on someone else's site unchanged?

2. **Numbers come with conditions, units, dates and a source.**
   - Eric Zhang: "72.3% mIoU at 37.3 FPS".
   - Den Delimarsky: "423,604 words written".
   - Julian Schrittwieser: "17 kB, or 6 kB compressed".
   - Omar Khattab: "downloaded several millions of times every month".

   Generated sites write "10x", "100+ agents shipped" or "99.99% uptime". Guillermo Rauch's unlabelled view counts show that even real numbers read as vanity without a label.

3. **Status and authorship are labelled honestly.**
   - Olah has a shelf called "Rough Notes".
   - Neel Nanda calls his posts "deliberately not quality controlled".
   - Maggie Appleton marks notes from seedling to evergreen.
   - Gwern states status and confidence on every page.
   - Linus Lee lists Retired and Unfinished projects.
   - Simon Boehm keeps his failed attempts in the write-up.
   - Omar Khattab's "Contributions:" line says which part was his.

   Generated pages present everything as finished, equally polished and implicitly all yours.

4. **Time is visible.**
   - Lynn Fisher's "v. XIX", with all 19 versions archived.
   - Rauno's 2022 and 2023 sites, still live.
   - Matt Webb's "New posts for 340 consecutive weeks".
   - Vicki Boykis's /changes page.
   - Kailash Nadh's site, "online since 2001 … Angelfire, Geocities".
   - Henry Desroches's "ver. ss25".

   A generated site has no past; it arrives whole. Neglect shows just as clearly and reads as "nobody home": a shop-cart icon left over from Squarespace on Jason Wei's and Chester Cho's sites, "lorem ipsum" left in, the word `undefined` in swyx's llms.txt.

5. **The structure is the thinking.**
   - Joe Carlsmith's sections mirror how his ideas depend on each other.
   - Sebastian Raschka gives 109 models the same spec card.
   - Karri Saarinen leads with 16 one-line notes.
   - Jason Wei numbers 82 thoughts.
   - Boris Cherny publishes his decision process.

   Generated sites give everyone the same outline: Hero, About, Projects, Skills, Contact.

6. **Explanations use a fixed visual vocabulary, defined first.**
   - Olah's yellow boxes and pink circles.
   - Transformer Circuits' line types.
   - Sam Rose's rule that a spiky dot failed and a hollow one timed out.
   - Jay Alammar's colour for each kind of data.

   Maggie Appleton publicly redrew an AI-generated agent diagram because it was cluttered and its arrows pointed the wrong way. Generated "AI architecture" art means glowing nodes, purple gradients or default Excalidraw sketches.

7. **Motion explains a change, and the reader controls the pace.**
   - Ciechanowski's sliders, and demos that pause off-screen.
   - ccunpacked.dev's 0.5× speed.
   - visualrambling.space's tap-to-advance.
   - Emil Kowalski's slow-motion key.
   - Bostock's static traces of every animation.

   Nobody in the Anthropic, OpenAI or explorables lanes uses scroll-jacking, parallax, cursor trails, typing headlines or scrambled text. The generated look animates everything on a timer: headings that split into letters, scrolling marquees, buttons that pull toward the cursor, percentage loaders. Every one of these has an Olivier Larose tutorial.

8. **One signature device, and everything else stays quiet.**
   - Ansub Khan's notebook ruler.
   - Tejas Kumar's red thread.
   - Aayush's blur-in name and clicks.
   - Ilan Bigio's exploding word.
   - Tim Holman's Order button.

   The Anthropic lane puts it well: designers commit to one idea and engineers keep it plain; what fails is the middle, a template plus effects. Dennis Snellenberg's kit became a template because its effects have nothing to do with its content.

9. **The voice has one dry, specific aside and no adjectives.**
   - Karpathy: "0 frameworks were used… because I am becoming seriously allergic to 500-pound websites".
   - Joanne Jang: "I will probably read it, but not reply (while feeling guilty about it forever)".
   - Carlini's photo caption: "Very surprising."
   - Kanjun Qiu: "Fair warning: I do not respond quickly to messages."

   Compare "passionate", "crafting immersive experiences", "Hi, I'm X 👋" and Empower / Unlock / Seamless.

10. **A life shows up next to the work.**
    - Alex Tamkin's ceramics.
    - Tim Brooks's photography.
    - Raphael Salaja's fashion notes.
    - Thariq Shihipar's contemplative essays.
    - Jack Clark's fiction.
    - Chip Huyen's List 100.
    - Thomas Wolf's path from physics to patent law to machine learning.

    Generated portfolios are entirely professional, which is why they feel anonymous. Yours would be the photography and multimedia years, if you want them in.

11. **The craft is in the parts nobody screenshots.**
    - Tim Brooks drops every animation duration to 1 ms for visitors who ask for reduced motion, and turns on smooth scrolling only after the first click or key.
    - Schulman's site prints like a paper.
    - Bigio loads his physics code only on the first click.
    - Tim Holman keeps a hidden plain-HTML menu for screen readers.
    - Aristide Benoist ships about 67 KB with no libraries.
    - Karpathy's site is two static files.

    Generated sites look finished in a screenshot and fall apart when printed, with reduced motion, without JavaScript or from the keyboard.

12. **AI use is disclosed precisely, not denied or hidden.**
    - Vicki Boykis publishes an AI policy.
    - Sander Dieleman writes that his prose is "artisanal intelligence".
    - Kaspar Etter adds a note on how he used AI.
    - Aayush publishes a ledger of the AI tokens he used.

    The two failure modes are a "no AI" badge that isn't true, and hidden text aimed at AI scrapers (Logan Kilpatrick's white-on-white paragraph, Jonathan Whitaker's pirate-voice prompt), which now reads as manipulation. For an AI engineer, the authored move is an exact /ai page.

---

## 4. Trends 2025–26: adopt, adapt, avoid

The verdicts are for v3 as it is today: Vite, React 19.2, TanStack Router, Tailwind 4, Motion 12.43 and Lenis 1.3.26. Dates and browser support come from the trends lane unless noted.

### Adopt

| Trend | Why, for you |
|---|---|
| A homepage that is an index: name, two sentences, then dated lists (Rauno, Paco, Karri Saarinen, Elliott Cost, Adam Pearce, Fabrice Bellard) | It is your stated taste and the consensus of the strongest sites; depth lives one click down |
| A lab of small instruments as proof (UX Tools, Feb 2026: reviewers spend about 55 seconds clicking around rather than reading) | Lets visitors try your actual design decisions; it isn't a game as long as there is no score |
| Same-page view transitions, with a named type for each kind of navigation (all major browsers since Firefox 144; React 19.3's `<ViewTransition>`) | Native page-to-page animation that costs nothing at runtime; v3 already has one `page` type to build on |
| Scroll-driven CSS animation, used only to show progress | Reading progress, or moving through a figure beside a case study; v3 already guards this with `@supports` |
| Editions and versions (Lynn Fisher, henry.codes, Rauno, Elliott Cost) | Slow, seasonal change is the most honest form of "lazy", and nobody can fake your history |
| More of the standard personal pages: /ai, /changelog and /why, next to your /now, /uses and /colophon (catalogued at slashpages.net) | Cheap, human, and the personal-web crowd reads them |
| A layer for AI agents: Markdown copies of pages, served when requested, and an llms.txt that says when to refer you and when not to | Fits someone who builds MCP servers; invisible to people; small cost |
| Exact AI disclosure (/ai) | Turns a 2026 controversy into a demonstration of your judgement |
| A strict editorial grid, without the magazine tells | Suits lists, numbers and rules. Avoid letter-spaced capital labels, tickers and italic pull-quotes |
| Gentle Lenis smoothing (0.07–0.08, no snapping) | It is already 0.075; below about 0.06 it starts to feel like the page is fighting the scroll wheel |

### Adapt

| Trend | How to adapt it |
|---|---|
| The warm-paper editorial look (the "Claude aesthetic") | Keep the warmth in texture, not colour; neel for structure; kesari only for things that move; no letter-spaced capital labels or italic-serif emphasis |
| Hand-drawn diagrams (rough.js, Excalidraw style, Mermaid's `handDrawn` look) | Use them only to annotate reasoning (the option you rejected, the cap you chose); keep ASCII as the figure. Full Excalidraw agent diagrams are a cliché on X and LinkedIn |
| ASCII, dither, grain and halftone (now available as drop-in presets) | Use ASCII only when the characters carry information, as yours do; a static woven texture; no shader effect as the headline |
| Presence without chat (playhtml, cursor-party, Bruno Simon's "Whispers") | One shared object in the background, or a "2 reading" mark; no other visitors' cursors over the text |
| A personal MCP server (only Arthur Monnet has one among the 257) | Read-only, 4–5 tools generated from your content package, documented as infrastructure |
| WebMCP (`navigator.modelContext`, in a Chrome 149 origin trial) | A dated lab note shown only where the browser supports it, not a feature |
| Scroll-triggered animations (Chrome 145/146 only) | One-time reveals as an extra; content is visible without them |
| Moving and variable-font type | One slow settle of your name, once; no headings revealed letter by letter |
| Command palettes (cmdk) | Keep it, but make it an index of every system, rule and figure step; it opens instantly, without animation |
| Sound and haptics | Off by default; at most one synthesized tick; put the control early in the tab order |
| Digital gardens | Growth stages and "last tended" dates; no graph view |
| Live clocks | Show minutes, and only if the clock drives something (the shared IST hour, the screensaver); never seconds |
| Receipt and ticket designs | Your receipt survives only because every line has a source; no tilt, glare or lanyard |
| Taste published as agent skills (Jakub Krehel, Emil Kowalski, Motion's AI Kit) | Publish your engineering rules as a skill. But this is also why AI-built sites converge, so what makes v3 distinctive must come from interactions shaped by your content |
| The personal-web revival and its anti-AI wing | Join the human channels (RSS, a webring, the printed Internet Phone Book); disclose AI use precisely; no "no AI" badge, because it would be untrue |
| Guestbooks | Scarce and moderated, or simply a "send a note" link |

### Avoid

| Trend | Why |
|---|---|
| "Ask my portfolio" chatbots | You ruled them out. Even craft-focused sites now add an "Ask" box, so leaving it out reads as a choice |
| Games, game-like navigation, fake desktop operating systems, terminal-style portfolios, 3D rooms and worlds you drive through | Saturated (ryOS clones; 74 GitHub repos tagged `terminal-portfolio`), and they put the content behind a skill test |
| Bento-box grids, 3D lanyard ID cards, purple gradients with Inter and frosted glass | Template tells: bento.me itself now redirects to Linktree, and the lanyard is an off-the-shelf React Bits component |
| WebGPU or React Three Fiber headline scenes | React Three Fiber's WebGPU support is still alpha; heavy and wrong for a reading site |
| GSAP alongside Motion | Free since version 3.13, but it would be a second animation runtime competing for the same frames |
| Scroll-jacking, pinned "cinematic" sections, heavy scroll inertia | Can cause physical discomfort for people with vestibular disorders (Josh Comeau), and takes the pace away from the reader |
| The award kit: loading screens, buttons that pull toward the cursor, custom cursors, letter-split headings, marquees | Each one has a tutorial; together they are the template |
| Dithered AI-video headlines | The 2026 "viral dithered website" recipe is made with AI video |
| Hidden text or prompts aimed at AI; traps for bots | Reads as manipulation or hostility, both wrong for an AI engineer |
| Walls of stats and numbers without labels | The fastest tell of all |

---

## 5. New tech worth using

Support status is as of October 2026, from the trends lane, except two rows marked as from my own knowledge.

"Baseline" is the web-platform label for features that work in all major browsers. "Origin trial" means a browser is testing the feature with sites that sign up.

| Tech | What it's for in v3 | Maturity and browser support | Fallback or caveat |
|---|---|---|---|
| Same-page view transitions, React 19.3 `<ViewTransition>` and `addTransitionType`, and TanStack's `defaultViewTransition.types` | Named page transitions (`into-system`, `back-to-index`, `next-note`) of 450–700 ms | Baseline since Firefox 144 (Oct 2025); React 19.3 stable since 9 Sep 2026 | Firefox 144 doesn't support named types, so it gets a plain crossfade; reduced motion also gets a crossfade only |
| View transitions on a single element (`el.startViewTransition()`) | Animate one figure between list and map without locking the page | Chrome 147 only | An extra only; use Motion's `layout` elsewhere |
| Scroll-driven animations (`animation-timeline: scroll()` / `view()`) | Reading progress; moving through a diagram beside a case study | Chrome 115+, Safari 26+; Firefox is a focus of the 2026 cross-browser effort (Interop 2026) | `@supports` guard, already in v3 |
| Scroll-triggered animations (`timeline-trigger`, `animation-trigger`) | One-time reveals | Chrome 145/146 only | Content visible without them |
| `@starting-style` with `transition-behavior: allow-discrete` | Entrance animations for the TL;DR card and popovers, without JavaScript | Baseline 2024 | Keep ⌘K un-animated, since it is opened from the keyboard |
| Anchor positioning | Side notes and "why this, not that" callouts pinned to the exact term or diagram node | Baseline Jan 2026 | Inline footnotes |
| `sibling-index()` / `sibling-count()` | A staggered first appearance for list rows, in CSS alone | Baseline Aug 2026 | Rows simply appear |
| `text-box-trim` | Lines headings up optically with rules and the ASCII grid | Baseline Aug 2026 | Harmlessly ignored |
| `progress()` | Maps a value to a style in CSS alone (for example, time of day to paper tone) | Baseline Sep 2026 | A fixed value |
| `linear()` easing | Spring-like settling for page transitions, in plain CSS | Baseline since late 2023 (my knowledge, not re-checked this session) | The existing `--ease-lazy` curve |
| Popover API (`popover`, `popovertarget`) | Search or note popovers with no JavaScript (as on Atharva Raykar's site) | Baseline 2024 (my knowledge) | None needed |
| Motion 14 (`layout`, `layoutId`, `animateView`, `AnimateView`) | List ⇄ map toggles; layout changes that animate | 14.0.0 released 2 Oct 2026; version 13.0 requires passing `isValidProp` to `MotionConfig` | Pin the version and test the upgrade; skip Motion+'s `Ticker` |
| Lenis 1.3.26 | Gentle scrolling, run from Motion's animation loop so there is one clock | Stable; respects reduced motion by default | Keep the smoothing at 0.06 or above |
| `IntersectionObserver` | Pause every demo when it is off-screen (Ciechanowski starts 300 px before it enters view) | Supported everywhere | None needed |
| Mermaid 12 `agentflow-beta` | The text source behind each figure (a "view source" of the structure), not the visual style | Beta | Your own text format in `diagrams.ts` |
| Rough Notation (about 3.8 kB) / rough.js (under 9 kB) | Hand-drawn boxes and brackets around reasoning | Mature | The existing `Scribble` component |
| SVG `feTurbulence` with `feDisplacementMap` | A slight hand-drawn wobble on marks, at 6–8 frames per second, on hover only | Mature | Off under reduced motion |
| Web Audio (synthesized sounds) | One optional paper tick | Mature | Off by default |
| llms.txt v2, Markdown copies of pages, and a Vercel rule that serves them when a request asks for `text/markdown` | The layer for AI agents | Spec v2 dated 10 Aug 2026; Cloudflare made this kind of serving a product in Feb 2026 | Be honest that 97% of llms.txt files get zero requests |
| MCP over Streamable HTTP (a read-only `/mcp`) | Your content as tools: `list_systems`, `get_system`, `get_rule`, `get_resume`, `search_notes` | The protocol is mature; such endpoints are rare on portfolios | A docs page with a `claude mcp add` example |
| WebMCP (`navigator.modelContext`) | A lab note: the page offers 3 read-only tools to AI agents running in the browser | Chrome 149 origin trial; not on the standards track | Check for support in code first; re-check later |
| OpenTelemetry GenAI semantic conventions | The data format for `TurnReplay` and `TraceReplay`, so span names match what observability people already know | In their own repo, still under development | Show the attribute names on hover |
| playhtml / PartyKit | One shared, persistent object (the lamp) | Beta (about 500 GitHub stars) | A lamp that isn't shared |
| h-resume microformats; JSON-LD `ProfilePage` | A /resume that machines can parse | Mature | None needed |
| Pagefind | Full-text search on a static site | Widely used (seen on msfjarvis.dev and sunilpai.dev) | The ⌘K index |

**Deliberately not picked:**
- GSAP, because it would be a second animation runtime.
- React Three Fiber and WebGPU, because WebGPU support is still alpha and too heavy.
- Rive, because it adds a dependency for one diagram.
- Sound by default.

---

## 6. Clichés to avoid

**Colour and type**
- A cream or beige background with a rust or terracotta accent, big italic serif emphasis and letter-spaced capitals. The New Yorker described this look in June 2026, and coverage calls it the "Claude aesthetic". v3 has letter-spaced capital labels in `components/home/SectionHead.tsx:16`, `routes/work/$slug.tsx:23` and `components/TraceReplay.tsx:125`.
- Anthropic's own brand colours (ivory `#f0eee6`, slate `#141413`, clay `#d97757`) and Tiempos-like serifs. Newsreader can't carry your identity either: Joe Carlsmith, Tim Brooks, Joanne Jang and Kartik Kwatra all use it.
- Purple-to-blue gradients, gradient text, Inter as the only typeface, frosted glass, very large corner radii, pulsing "Live" pills, and cards with one thick coloured border.
- Ticker and marquee bars of logos or "showreel • 2025 •".
- Emoji as section icons.

**Layout and format**
- Bento-box grids; a centred headline with a pill badge, two buttons and three identical cards.
- Fake desktop operating systems, terminal-style portfolios, VS Code clones, and headlines made of code (`class Person {}`).
- 3D rooms, desks and lanyard ID cards; worlds you drive through.
- The Brittany Chiang layout (a pinned left column, a spotlight that follows the cursor, a list that dims on hover), and the shadcn-style CV (tag pills plus a command menu).
- Academic templates (AcademicPages, al-folio, Wowchemy, PaperMod) used unmodified.
- A profile on someone else's platform as your main home. read.cv, Polywork and Bento have all shut down.

**Motion and effects**
- Loading screens with percentage counters; "click to enter" or "enter with sound" gates.
- Custom cursors, buttons that pull toward the cursor, "View" bubbles, and images that follow the cursor over lists.
- Headings that split into letters, paragraphs revealed word by word, text whose gradient changes as you scroll, and scrambled text.
- Scroll-jacking, pinned "cinematic" sections, parallax and heavy scroll inertia.
- Animations that loop forever, animated theme switches, animation on keyboard actions, and elements that grow from nothing (`scale(0)`).
- Full-screen animated grain, dithered video headlines, and binary or "Matrix" digits as decoration.
- A clock ticking seconds as decoration.

**AI-specific**
- "Ask my portfolio" chat, a chat transcript as your biography, a voice agent that talks about you.
- Glowing node graphs, particle "brains" and neon gradients standing in for "AI".
- Lilian Weng's planning / memory / tools diagram, or Anthropic's five workflow-pattern boxes, reskinned and presented as your architecture.
- "MCP is like USB-C for AI".
- Fake terminals typing fake output, shimmering "Thinking…" text, and dashed lines that animate but carry no meaning.
- AI-generated diagrams and textures presented as hand-made.
- Hidden prompts aimed at AI scrapers or résumé-screening software; traps for bots.

**Content and copy**
- Walls of stats ("10x", "100+ agents shipped"), skill bars and percentages, walls of logos, a contribution heatmap as the headline, and numbers without labels.
- "Passionate", "crafting immersive experiences", "pushing boundaries", "Empower / Unlock / Seamless", "Hi, I'm X 👋", and headlines that type themselves out.
- Indian identity shown through a flag and a "Namaste" instead of specific, true local details.
- Testimonial carousels, "as featured in" logo walls, and floating "Hire me" buttons.

**Maintenance**
- Leftovers from a site builder (a shop-cart icon, "lorem ipsum", "Coming in 2023").
- Roles that are out of date.
- Outbound links that now lead to spam.
- Generated files nobody checked (the word `undefined` in an llms.txt).
- A site too elaborate to keep up: Cassie Evans retired hers.
- In v3, the `/play` route (prompt golf) conflicts with "no games". The security hardening behind it is worth keeping as a note instead.

---

## 7. Fifteen concrete ideas for v3

These are combinations rather than copies. Each one is grounded in your real systems and uses public names only. The creative lane's warning applies: pick a few that reinforce each other and keep everything else plain. A suggested build order follows the list.

| # | Idea | Effort | Mainly inspired by |
|---|---|---|---|
| 1 | Neel for the system, kesari for what moves | S | Naz Hamid, the "Claude aesthetic" coverage, Salma Alam-Naylor |
| 2 | One request, slowed down | L | ccunpacked.dev, Nick Tikhonov, AI 2027, Chris Olah, Jay Alammar, Mike Bostock |
| 3 | /systems: one spec card per system, a Compare view, a taken-apart view | M | Sebastian Raschka, Omar Khattab, Rauno, Joffrey Spitzer |
| 4 | Decision cards that ask before they tell | M | Lena Voita, Gwern, Dario Amodei, Simon Boehm |
| 5 | /lab: three instruments, not games | M | Sam Rose, Ian Silber, Alexander Mordvintsev, Emil Kowalski, Bret Victor |
| 6 | Field notes, a Thinking ⇄ Structure toggle, a catalogue of failures | M | Transformer Circuits, Nelson Elhage, Arpit Bhayani, Tim Holman |
| 7 | "How I think": numbered beliefs, open questions, a decision loop | S | Karri Saarinen, Jason Wei, Kanjun Qiu, Boris Cherny, Den Delimarsky |
| 8 | A layer for AI agents, built like your production servers | M | Arthur Monnet, Peter Steinberger, Jesper Landberg, Answer.AI |
| 9 | /ai: an exact credits page, and a footer mark that's true | S | Damola Morenikeji, Vicki Boykis, Sander Dieleman, Christopher Kirk-Nielsen |
| 10 | Editions: "v3 · varsha '26", a changelog, old sites kept | S | Lynn Fisher, Henry Desroches, Jonas Reymondin, Alex Komoroske |
| 11 | The shared IST hour | M | Felix Rieseberg, Bruno Simon, Spencer Chang |
| 12 | /index of everything, plus a "since 2022" path | S | Adam Pearce, Elliott Cost, Fabrice Bellard, Kailash Nadh |
| 13 | /resume as the calmest page | M | Karpathy, Eugene Yan, Bret Victor, Will Larson, Jamie Tanna |
| 14 | Hand-made marks: margin notes that wobble, one printable zine page | S | Andrew Woan, Linus Lee, Julia Evans, IDEA |
| 15 | Name, voice and a person: two scripts, one true local line, a photography room | S | Thejesh GN, Sayak Paul, Jatan, Nemo, Tim Brooks |

Effort: S is hours, M is a day or two, L is more.

### 1. Neel for the system, kesari for what moves

- **What it is.** Your own CSS comment says "Indigo for the things in a system, saffron for what moves through it." Make that rule strict:
  - Links, rules, section numbers and diagram nodes use neel `#3a4a8c`.
  - Kesari `#d9661a` is used only for moving packets, the one live state and the `Scribble` stroke.
  - The letter-spaced capital labels become monospace `§ 02` or Devanagari numerals (`०२`).
  - No italic-serif emphasis in headings, and no tickers.
  - The warmth moves into texture: a static woven khadi pattern at very low contrast, taken from a photo of a real swatch rather than generic grain.
  - Optionally, a "neel mode" for architecture pages only: an indigo blueprint background with khadi-coloured lines, because an architecture drawing is a blueprint.
- **Motion.** None. Theme changes are not animated (Rauno's rule).
- **Where.** `styles/globals.css`, `components/home/SectionHead.tsx:16`, `routes/work/$slug.tsx:23`, `components/TraceReplay.tsx:125`.
- **Inspired by:**
  - Naz Hamid's "Fade to Blue";
  - the "Claude aesthetic" checklist from The New Yorker coverage;
  - Salma Alam-Naylor's redesign built from one real object;
  - Tim Brooks's paper colour per section;
  - the Anthropic lane's colour comparison (re-measured in the appendix).

### 2. One request, slowed down: the flagship architecture explainer

- **What it is.** One sanitised request walks through your real stack, in this order:
  1. The workspace sends the request.
  2. The query service checks it before replying "202 Accepted".
  3. The agent loop runs at most 4 rounds, cuts each tool result at 8,000 characters, and ends with one call that offers no tools, so the model has to answer in text.
  4. The tool gateway carries the user's identity in headers, never in tool arguments.
  5. The model switchboard translates for each provider and places prompt-cache breakpoints.
  6. The cost ledger records an unmeasured cost as unmeasured, never as zero.

  It works like this:
  - A 5-symbol legend comes first: model call, tool, loop step, store or ledger, guard.
  - One part lights up per step.
  - Each chapter is timestamped ("02:13:04.120 IST · request enters").
  - A counter of ms, tokens, rounds and cost moves to each chapter's values.
  - The whole run sits underneath as one static waterfall.
- **Motion.**
  - The reader sets the pace: step, scrub, or play at 0.5× by default.
  - The view pans between parts over 800–1200 ms.
  - Numbers ease into place.
  - Everything pauses when off-screen.
  - Under reduced motion it becomes the waterfall plus one still figure per step.
  - It prints as the waterfall.
- **Where.**
  - On `/work/*` pages and the home page.
  - It builds on `SteppedFigure`, `TurnReplay`, `TraceReplay`, `packages/content/src/replay.ts` and `diagrams.ts`.
  - Feed it a trace in the OpenTelemetry GenAI format.
- **Inspired by:**
  - ccunpacked.dev's 11-step walkthrough at 0.5×;
  - Nick Tikhonov's running latency counter;
  - AI 2027's pinned dashboard;
  - Chris Olah and Jay Alammar: the legend first, then one more layer per step;
  - Chip Huyen: one box added per step;
  - Mike Bostock: a static trace of every animation;
  - Ciechanowski: the off-screen pause;
  - Henry Heffernan: events reported to the diagram.

### 3. /systems: one spec card per system, a Compare view and a taken-apart view

- **What it is.** Every system gets the same card, with these fields:
  - transport
  - trust boundary
  - failure policy
  - state
  - budget
  - where its telemetry goes
  - key detail
  - "My part"
  - status
  - last updated
  - a row of symbols for its mechanisms: deadline, cancellation, ledger, files passed by reference, acting as the user

  The Compare view shows two real versions of a system side by side:
  - the tool gateway's three architectures in eight months;
  - four drifting copies of the LLM configuration replaced by one library (89 releases).

  An assembled ⇄ taken-apart toggle separates a system into layers, using the shared diagram vocabulary. On /work, a List ⇄ System-map toggle rearranges the same rows into nodes grouped by layer.
- **Motion.** Taking a system apart or putting it back takes about 700 ms and can be interrupted. It is instant under reduced motion. Built with Motion's `layout` and `layoutId`.
- **Where.** `packages/content/src/systems.ts`, `/work`, `components/home/WorkIndex.tsx`.
- **Inspired by:**
  - Sebastian Raschka's LLM Architecture Gallery;
  - Omar Khattab's "Contributions:" line;
  - Sander Dieleman's legend of ingredients;
  - the status labels of Linus Lee and Thariq Shihipar;
  - Rauno's finished and taken-apart views;
  - Joffrey Spitzer's Grid ⇄ List toggle.

### 4. Decision cards that ask before they tell

- **What it is.** Each card has:
  - the constraint you faced;
  - a folded "What would you do?";
  - your choice;
  - the option you rejected, with its number;
  - what broke later;
  - a one-line header: status · confidence · what I'd change.

  The content already exists:
  - "Validate before the 202"
  - "Offer file tools only when the user asked for a file"
  - "One confidentiality line, once" (blocked calls went from 3/12 to 0/12)
  - "A stop is not an error"
  - "Spreadsheets are queried, not retrieved" (graded questions went from 2/8 to 6/8)
  - "Never shrink a tall image into fiction"
- **Motion.** The answer opens in about 320 ms (height and fade) and can take keyboard focus. Instant under reduced motion.
- **Where.** Sections of `/work/*`, plus a `/decisions` index. The content comes from my decision records.
- **Inspired by:**
  - Lena Voita's research cards;
  - Gwern's status and confidence header;
  - Dario Amodei's "assumptions and framework" opening;
  - Maggie Appleton's growth stages;
  - Simon Boehm keeping his failed attempts.

### 5. /lab: three instruments, not games

- **What it is.** Three instruments, all behaving the same on every run with no model calls, each with a "what this simplifies" footnote:
  1. **Loop cost.** Drag the number of rounds and the result size, and watch tokens and cost grow with the square of the loop, with caching on or off. Your real cap of 4 rounds and the 8,000-character cut are marked as the decision you made.
  2. **Stop.** Press Stop at any moment in a run. See the check that runs about once a second, the checkpoint before the next model call, and the partial results that stay.
  3. **By reference or inline.** Flip between a generated file passed as raw bytes (about 170,000 tokens) and passed by reference (about 30 tokens).
- **Motion.**
  - The reader drives everything.
  - A settings drawer holds the constants.
  - Values ease into place, and each instrument pauses off-screen.
  - Under reduced motion it shows a static chart.
  - There is no score and no leaderboard.
- **Where.** It replaces `/play`, since prompt golf conflicts with "no games". Keep the story of how you hardened that public endpoint as a note.
- **Inspired by:**
  - Sam Rose's load-balancing and retries essays;
  - Ian Silber's settings drawer;
  - Josh Puckett's DialKit;
  - Alexander Mordvintsev's live toys;
  - Rasmus Andersson's measuring tools;
  - Emil Kowalski's before/after toggles;
  - Bret Victor's adjustable numbers (Tangle);
  - UX Tools' "the portfolio is becoming a playground".

### 6. Field notes, a Thinking ⇄ Structure toggle and a catalogue of failures

- **What it is.**
  - **Notes become a thread.** Each note is numbered (№ 014), dated and typed: note · system · incident · tool.
    - Each is titled as a claim ("Unknown is not zero", "Prompt position is architecture").
    - Each carries drafted → published dates and a growth stage.
  - **A shelf inside the notes, "Agent failures, catalogued".** It holds real failure modes you debugged, each with the symptom, the root cause and the fix:
    - a tall screenshot shrunk until the model invented a report;
    - a 2-chunk file invisible inside a 435-chunk vector store;
    - a mirror that wrote rows correctly while the reading side dropped them.
  - **A toggle with two views of the same notes:**
    - Order: the dated list, which is the default.
    - Flow: titles and open questions drift slowly as neel threads.
  - **A status line under the list:** "14 notes · 5 open questions · last tended 2 days ago".
- **Motion.**
  - In Flow, the threads drift very slowly and pause off-screen.
  - The toggle rearranges the items over about 700 ms.
  - Order is the default on mobile and under reduced motion.
  - A real HTML list is always underneath.
- **Where.** `/notes`, `components/home/NotesPreview.tsx`, `packages/content/src/notes.ts`.
- **Inspired by:**
  - Transformer Circuits' dated thread and tags;
  - Nelson Elhage's single-genre collections;
  - Arpit Bhayani's notes titled as claims;
  - Holden Karnofsky's posts drafted ahead;
  - Neel Nanda's numbering;
  - Tim Holman's Order button;
  - Maggie Appleton's growth stages.

### 7. "How I think": numbered beliefs, open questions and a decision loop

- **What it is.** Four parts:
  1. **12–15 numbered beliefs, one line each, taken from your principles.** Each opens inline to the incident and the measurement that taught it. For example:
     - "Unknown is not zero"
     - "The model only picks, never adds"
     - "Code computes; the model narrates"
     - "Delete with evidence, including your own work"
  2. **6–10 open questions, marked as pointers rather than claims.** For example: "When should a tool call outlive the turn that started it?"
  3. **A small loop diagram of how you decide.** Measure, decide, keep the rejected option with its number, and revisit when a metric (not a date) says so. A slow arc returns to "measure" when you hover over "new data".
  4. **A /how-i-work page:**
     - plan first, then work in gated steps;
     - decision logs kept next to the code;
     - tests named as sentences about behaviour.
- **Motion.** Items open in 200–320 ms. The loop arc is the only slow element: about 1.2 s, once per hover.
- **Where.** Restructure `components/home/RulesLog.tsx`, `components/home/HowIWork.tsx`, `rules.ts` and `practice.ts`.
- **Inspired by:**
  - Karri Saarinen's "Notes on building";
  - Jason Wei's numbered thoughts;
  - the belief lists of Logan Kilpatrick, Nat Friedman and Victor Mustar;
  - Kanjun Qiu's open questions;
  - Boris Cherny's published decision process;
  - Den Delimarsky's /how-i-work;
  - Jason Liu's user manual.

### 8. A layer for AI agents, built like your production servers

- **What it is.**
  - **Markdown copies.** Every page has a Markdown copy, served when a request asks for `text/markdown` (a Vercel rule that checks the request header) and linked from each page's header.
  - **llms.txt.** It has a "Last updated" line, a "When to refer Jayesh" section and a "Not the right referral for" section.
  - **A /for-agents page** that people can read too: who you are and how to cite you.
  - **A read-only `/mcp`.** It offers 4–5 tools generated from `@jrk/content`, built with your real conventions:
    - typed schemas;
    - tags in `_meta`;
    - a size budget for results;
    - no credentials.
  - **For people:** one footer line, "This site is agent-readable".
  - **In the colophon:** a candid note that most agents don't fetch these files yet.
- **Motion.** None.
- **Where.** `public/llms.txt` (already exists), `apps/web/scripts/generate.ts`, and a small server route for `/mcp`.
- **Inspired by:**
  - Arthur Monnet's `/mcp`;
  - the Markdown copies of Peter Steinberger and Jesper Landberg;
  - Brian Lovin's llms.txt;
  - Answer.AI and llmstxt.org;
  - Salma Alam-Naylor's page for language models;
  - Den Delimarsky, who maintains MCP;
  - Ahrefs' data on who actually reads llms.txt.

### 9. /ai: an exact credits page, and a footer mark that's true

- **What it is.** Four short sections:
  1. What on this site AI wrote or generated, and with which tools.
  2. What you wrote and decided yourself.
  3. How you use AI at work: Claude Code skills, parallel worktrees, decision logs. You own the framing, architecture, decisions, integration and debugging.
  4. When the page was last updated.

  A small footer mark, "AI-assisted, human-decided", links to it.
- **Motion.** None.
- **Where.**
  - A new `/ai` route.
  - The footer, which also lists the standard pages: `/now /uses /colophon /ai /changelog /why`.
- **Inspired by:**
  - Damola Morenikeji, who started the /ai page;
  - Vicki Boykis's AI policy;
  - Sander Dieleman's "artisanal intelligence";
  - Kaspar Etter's disclosure;
  - Christopher Kirk-Nielsen's "no A.I." mark, turned into a version that is true for you;
  - xypnox;
  - Aayush's token ledger.

### 10. Editions: "v3 · varsha '26", a changelog and the old sites kept

- **What it is.**
  - **An edition label** named after the Indian season (varsha is the monsoon).
  - **A one-line editor's note** on the home page that changes with each edition: what moved since the last one.
  - **A /changelog page** in the Keep-a-Changelog format.
  - **The old sites, kept at dated URLs,** each with a line on what you believed then:
    - v1, the 2024 MS-DOS and Commodore 64 terminal site;
    - v2.
  - **A tiny rolling-digit counter ("jrk · v3")** that links to /changelog.
- **Motion.** The counter rolls once on first view (about 800 ms), then rests.
- **Where.** The footer, `/changelog`, `/colophon`.
- **Inspired by:**
  - Lynn Fisher's "v. XIX" and archive;
  - Henry Desroches's "ver. ss25" and editor's letter;
  - Jonas Reymondin's "Folio:06";
  - Rauno's old versions still live;
  - Alex Komoroske's "Blast from the past";
  - Vicki Boykis's /changes;
  - Flora Guo's version numbers.

### 11. The shared IST hour

- **What it is.**
  - The page's light follows Noida's time for every visitor, whatever their own time zone:
    - the paper warms a little after about 18:00 IST;
    - a lamp comes on after about 22:00;
    - the monsoon months get a damp texture and December a faint haze.
  - The clock shows minutes, not seconds, and says something: "02:14 in Noida, I'm probably asleep; I reply within a day".
  - The screensaver uses the same state.
  - Optionally, the lamp is a shared switch any visitor can flip, showing "last switched 3 h ago" (built on playhtml or PartyKit).
- **Motion.** The tone changes over minutes, so nobody sees it move. Under reduced motion it is static.
- **Where.** `components/layout/Clock.tsx`, `components/layout/Screensaver.tsx`, `styles/globals.css` (with `progress()`, or a CSS variable set once a minute).
- **Inspired by:**
  - Felix Rieseberg's rainy Berlin window;
  - Bruno Simon's day and season cycles;
  - the local time shown by Justin Jay Wang and Benji Taylor;
  - Spencer Chang's shared lights;
  - the India lane's survey: at most one of 102 Bangalore personal sites shows IST.

### 12. /index of everything, plus a "since 2022" path

- **What it is.**
  - **One list of everything.** It is lowercase and grouped by year, covering every system, note, release and talk. Each entry has a № number and a type tag, and favourites are marked in kesari.
  - **A releases ledger** generated from your public tags.
  - **A path log:**
    - from your first repo in Dec 2022 ("my first college project");
    - through campus photography and your internships;
    - through your first agents;
    - to Netision.
  - **Your public contribution curve** (6 → 16 → 82 → 643 → 1,292) as one quiet line.
- **Motion.** On first view, rows appear in a CSS-only stagger, 40–60 ms apart, once.
- **Where.** `/index`, `components/home/PathLog.tsx`, `contributions.json`.
- **Inspired by:**
  - Adam Pearce's index;
  - Elliott Cost's numbered projects;
  - Fabrice Bellard's list;
  - Tristan Hume's year log;
  - Kailash Nadh's /releases;
  - Brittany Chiang's archive table;
  - Eugene Yan's counters computed at build time.

### 13. /resume as the calmest page

- **What it is.**
  - **Era sentences.** Three first-person sentences, one per era, come before any bullets.
  - **Role lines in Eugene Yan's format,** for example `2025 – now · AI Engineer @ Netision (agent runtime · model layer · ledger · MCP tools)`.
  - **Two bios.** A one-sentence "Real bio", with a ready-to-copy "Promotional bio" behind a disclosure.
  - **"Read as" views.** "Read as: hiring manager · engineer · agent". The agent view shows `/resume.md` verbatim.
  - **Linked skills.** Skill words highlight the bullets that used them.
  - **Sources.**
    - Each bullet carries a tag saying where its number comes from.
    - A footer reads "N claims · N sourced · updated · rev".
    - A content test fails when a number has no source.
  - **A "What I'm looking for next" section.**
  - **A trimmed print edition.** Printing gives a one-page edit on an A4 sheet sized in millimetres.
- **Motion.**
  - Switching views is a 600–700 ms page transition.
  - Bullets that don't match fade to 45% opacity over 400 ms, and clearing the highlight is instant.
  - There are no transitions in print.
- **Where.** `routes/resume.tsx`, `packages/content/src/resume.ts`, `packages/content/src/content.test.ts`.
- **Inspired by:**
  - Karpathy's era sentences;
  - Eugene Yan;
  - Bret Victor's two bios;
  - Will Larson's linked skills;
  - Justin Garrison's résumé branch per role;
  - Jamie Tanna's "what I'm looking for" and print edition;
  - Tiger Oakes's physical units;
  - RenderCV, but checking truth, not just format;
  - John Schulman's print styles.

### 14. Hand-made marks: margin notes that wobble, and one printable zine page

- **What it is.**
  - **Handwritten notes in JRK Hand,** drawn over real figures and charts, and only where they mark reasoning:
    - "the cap";
    - "rejected: batching the clusters (measured slower)";
    - "this is where the mirror fell behind".
  - **One printable page, "How one tool call works".** It is either hand-drawn or a wordless assembly poster, and downloadable as a PDF.
- **Motion.** A slight hand-drawn wobble: an SVG noise setting changes 6–8 times a second, on hover only, so marks look drawn rather than animated. Off under reduced motion.
- **Where.** `components/Scribble.tsx`, `/work/*`, `/colophon`.
- **Inspired by:**
  - Andrew Woan's papercraft portfolio;
  - Linus Lee's annotated chart;
  - Julia Evans's zines;
  - IDEA's wordless posters;
  - Nikshep's handwritten blog;
  - Maggie Appleton's redraw of an AI-generated diagram;
  - Simon Boehm's hand-drawn diagrams.

### 15. Name, voice and a person: two scripts, one true local line, a photography room

- **What it is.**
  - **Your name in two scripts:** "Jayesh Ranjan Kesari / जयेश रंजन केसरी" (Tiro Devanagari), with the Devanagari as a quiet second voice.
  - **A plain one-line headline about what you build,** for example "I build the runtime around the model: the loop, the tools it calls, and the ledger that says what each turn cost."
  - **A two-sentence bio.**
  - **One specific, true line about Noida.**
  - **Honest reply expectations.**
  - **If you opt in, a photography room** with captions that give only the place ("Noida, UP").
- **Motion.** Your name settles once, on a heavy, slow spring, so it is lazy because of physics rather than easing. Alternatively, Newsreader settles into its optical size once. No letter-by-letter animation on headings.
- **Where.** `components/home/Hero.tsx`, `about.ts`, a `/photos` page.
- **Inspired by:**
  - the names of Thejesh GN and Sayak Paul in their own scripts;
  - Jatan's poem in three layers;
  - Shunyu Yao's two-sentence bio;
  - Nemo's Aadhaar line;
  - Alex Albert's bio about a place;
  - Tim Brooks's plain headline and photography room;
  - Joanne Jang's honest contact copy;
  - Patrick Heng's spring-loaded letters;
  - Kailash Nadh's place-only captions.

### Suggested build order

1. **Foundation (hours):**
   - 1, the colour rule;
   - 9, /ai;
   - 10, editions and changelog;
   - the static half of 8 (Markdown copies and llms.txt).

   These change how the whole site reads for little effort.
2. **The flagship:**
   - 2, one request slowed down;
   - 4, decision cards inside it.

   This answers "show how the AI architecture works" and "my thinking" in one place.
3. **Structure:**
   - 3, /systems;
   - 7, "How I think";
   - 13, /resume.
4. **Texture, once the above feels calm:**
   - 6, notes;
   - 11, the IST hour;
   - 12, the index;
   - 14, hand-made marks;
   - 15, name and voice.
5. **Optional:**
   - 5, the lab;
   - the `/mcp` half of 8;
   - the shared lamp in 11.

---

## Appendix

### A. Corrections to the lane notes (checked against the repo on 2026-10-09)

- **Colour distance.** The Anthropic lane's ΔE 1.0 (perceptually identical to Anthropic's ivory) was measured against an older paper colour, `#f3efe6`. I re-measured the current tokens in `apps/web/src/styles/globals.css` with my own CIEDE2000 script. It reproduces the old 1.0, so the numbers are comparable.

  | v3 token | Nearest Anthropic token | ΔE2000 |
  |---|---|---|
  | paper `#f1ead8` | ivory-dark `#e8e6dc` | 3.6 |
  | paper-2 `#e9e1cc` | oat `#e3dacc` | 3.4 |
  | ink `#1c2033` | slate-dark `#141413` | 12.4 |
  | kesari `#d9661a` | accent `#c6613f` | 9.0 |
  | kesari `#d9661a` | clay `#d97757` | 10.0 |
  | neel `#3a4a8c` | slate-dark `#141413` | 29.5 |

  The exact colour clash is fixed. The genre problem in idea 1 isn't.
- **Letter-spaced capital labels** are confirmed at `SectionHead.tsx:16`, `work/$slug.tsx:23` and `TraceReplay.tsx:125`. The receipt header's 0.3em letter-spacing follows receipt convention and can stay as the only exception.
- **Page transitions.** v3 already passes `defaultViewTransition` with a single `page` type in `apps/web/src/main.tsx`. It already names the header and case titles for transitions (`viewTransitionName`). Lenis smoothing is 0.075 in `SmoothScroll.tsx`.
- **Fallback ladders.** The lanes' fallback-ladder ideas are recast in section 7 to match your shipped design: an explicit choice of model per request.

### B. Not counted in the 257

- **Corroborated or search-only:** neal.fun and Sam Bowman.
- **Nothing observable:** Alana Goyal, Alex Widua, Preston Booth and Chloe Yan.
- **Opened but nothing recorded:** akkartik.name, adit.io, anish.io, sahillavingia.com, gilhuybrecht.com, flavorfulsuffering.xyz.
- **Dead or parked:** shancarter.com, sholtodouglas.com, willdepue.com, romainhuet.com, tejalpatwardhan.com, lukaszkaiser.com, joshachiam.com, sbubeck.com, adityaramesh.com, nickcammarata.com, atty.dev, thomasdegry.com and read.cv.
- **Different person or out of scope:** aidanmclaughlin.com, benjaminzweig.com, nicolasbackal.com and zegzulka.com.
- **Company pages and single posts used only as evidence:**
  - Anthropic's "Building effective agents";
  - sketch.dev's post on the agent loop;
  - Granola's "Don't animate height";
  - norahsakal.com, the source of the "USB-C" analogy;
  - growingswe.com;
  - ascii.rest;
  - thinkingmachines.ai.
- **The IndieWebClub Bangalore homepage survey** (102 sites), reported in lane F's intro.

### C. Method

- **Nine lanes, all researched on 2026-10-09.** Each used:
  - WebSearch to find candidates;
  - WebFetch on the live pages;
  - curl for raw HTML, CSS and JS where a page renders in JavaScript, to read fonts, easing curves, colour tokens and how the site was built.
- **Downloaded code was read as text only and never run.**
- **Hacker News popularity figures** come from the hn.algolia.com API.
- **Browser support** comes from MDN, web.dev, the Chrome and WebKit blogs, and the React and Motion changelogs, as cited in the trends lane notes.
- **Facts about me** come from my own repositories and résumé, checked one by one.
