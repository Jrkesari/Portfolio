// Sites that changed something on this one. Picked from the research notes in
// docs/research — each with the idea that made it here, in one line.

export interface Inspiration {
  person: string;
  url: string;
  what: string;
  group: string;
}

export const inspirations: Inspiration[] = [
  // At AI labs
  { group: "At AI labs", person: "Chris Olah", url: "https://colah.github.io", what: "A legend before the mechanics, then one part lit per figure. Every figure here steps that way." },
  { group: "At AI labs", person: "Adam Pearce", url: "https://roadtolarissa.com", what: "Prose asks, the figure answers, the prose interprets: the order each replay follows." },
  { group: "At AI labs", person: "Andrej Karpathy", url: "https://karpathy.ai", what: "One dry aside on an austere page is enough. See the bottom of the receipt." },
  { group: "At AI labs", person: "Tristan Hume", url: "https://thume.ca", what: "A log of everything, from the first crappy website on. The git graph of my path is the same idea." },
  { group: "At AI labs", person: "Thariq Shihipar", url: "https://thariq.io", what: "An honest status on every project. The local agent says prototype, because it is one." },
  { group: "At AI labs", person: "Ilan Bigio", url: "https://ilanbigio.com", what: "Leave something in the console for whoever opens it." },
  { group: "At AI labs", person: "AI Futures Project", url: "https://ai-2027.com", what: "A figure that stays put while the story moves. The replay's diagram holds still as the trace plays." },
  { group: "At AI labs", person: "Peter Steinberger", url: "https://steipete.me", what: "A clean, agent-readable twin of the site. Here: llms.txt and a Markdown résumé." },

  // Explaining systems
  { group: "Explaining systems", person: "Bartosz Ciechanowski", url: "https://ciechanow.ski", what: "Build the system from nothing and let the reader drive. The replays run at your speed, or not at all." },
  { group: "Explaining systems", person: "Sam Rose", url: "https://samwho.dev", what: "Requests you can watch move: the packets walking the figures." },
  { group: "Explaining systems", person: "Bret Victor", url: "https://worrydream.com", what: "Reactive documents: pick a different moment, and the figure and the prose change together." },
  { group: "Explaining systems", person: "Chip Huyen", url: "https://huyenchip.com", what: "One architecture, drawn up a box at a time." },
  { group: "Explaining systems", person: "Thorsten Ball", url: "https://ampcode.com/how-to-build-an-agent", what: "An agent is a loop, some tools and a way to stop. Fig. 1 starts there." },
  { group: "Explaining systems", person: "Julia Evans", url: "https://jvns.ca", what: "Plain words for hard systems, and a handwritten note in the margin." },
  { group: "Explaining systems", person: "Simon Willison", url: "https://simonwillison.net", what: "Write it down while it's fresh. The field notes are that habit, in public." },

  // Craft and motion
  { group: "Craft and motion", person: "Emil Kowalski", url: "https://emilkowal.ski", what: "Anything you touch answers in about 200 ms. The slowness is only where nothing waits on it." },
  { group: "Craft and motion", person: "Paco Coursey", url: "https://paco.me", what: "Radical restraint. And cmdk, the library under the ⌘K menu here." },
  { group: "Craft and motion", person: "Cyd Stumpel", url: "https://cydstumpel.nl", what: "Nearly all the motion in plain CSS: scroll-driven animations and view transitions, no animation library." },
  { group: "Craft and motion", person: "darkroom.engineering", url: "https://darkroom.engineering", what: "Lenis, the slow scroll under every page." },
  { group: "Craft and motion", person: "Maggie Appleton", url: "https://maggieappleton.com", what: "Notes that say how finished they are. Mine say draft until they aren't." },
  { group: "Craft and motion", person: "Lynn Fisher", url: "https://lynnandtonic.com", what: "The site's own history is part of the portfolio, hence the version list at the top of this page." },

  // AI builders
  { group: "AI builders", person: "Sebastian Raschka", url: "https://sebastianraschka.com", what: "Ask every system the same questions (motive, decisions, what was ruled out, what it doesn't fix), and the differences show." },
  { group: "AI builders", person: "Hamel Husain", url: "https://hamel.dev", what: "Evals as the spine. On the receipt, “eval” means a fixed graded set, same model and prompt." },
  { group: "AI builders", person: "Sander Dieleman", url: "https://sander.ai", what: "Say plainly where AI was involved in making the site." },
  { group: "AI builders", person: "Vicki Boykis", url: "https://vickiboykis.com", what: "A site that documents itself. This page." },
  { group: "AI builders", person: "Jeremy Howard · Answer.AI", url: "https://www.answer.ai", what: "llms.txt: a clean index for models, generated here from the same content as the pages." },
  { group: "AI builders", person: "Matt Webb", url: "https://interconnected.org/home", what: "Time as material. A clock, a page that dozes off, a site that feels lived in." },

  // Builders in India
  { group: "Builders in India", person: "Kailash Nadh", url: "https://nadh.in", what: "A quiet page that knows its own history." },
  { group: "Builders in India", person: "Arpit Bhayani", url: "https://arpitbhayani.me", what: "Notes titled as claims. “Unmeasured is not zero” is one." },
  { group: "Builders in India", person: "S Anand", url: "https://s-anand.net", what: "Written for people and for agents at once." },
];
