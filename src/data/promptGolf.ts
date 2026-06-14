// Prompt Golf — a tiny prompt-engineering game.
// Goal: write the SHORTEST prompt that makes the AI produce the target output.
// Scored by the word count of YOUR prompt vs. par. Lower is better — like golf.

export interface GolfRound {
  id: string;
  /** What the player has to make the AI say / do. Shown in the UI. */
  instruction: string;
  /** Human-readable target shown to the player. */
  target: string;
  /** Word-count par for the player's prompt. Beat it for birdie. */
  par: number;
  /** Hint revealed on request. */
  hint: string;
}

export const golfRounds: GolfRound[] = [
  {
    id: "exact-phrase",
    instruction: "Make the AI reply with exactly this, nothing else:",
    target: "the eagle has landed",
    par: 6,
    hint: "You don't have to ask a question — you can just tell it what to output.",
  },
  {
    id: "single-emoji",
    instruction: "Make the AI's entire reply be a single 🍍 (pineapple) and nothing else.",
    target: "🍍",
    par: 5,
    hint: "Constrain the format hard: 'reply with only…'.",
  },
  {
    id: "haiku-rain",
    instruction: "Make the AI answer with a haiku about rain (3 lines).",
    target: "a 3-line haiku about rain",
    par: 7,
    hint: "Name the form and the topic. The model handles the 5-7-5.",
  },
];
