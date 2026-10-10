import { site } from "@jrk/content";

// For whoever opens devtools first.
let said = false;
export function sayHello() {
  if (said || typeof window === "undefined") return;
  said = true;
  const box = [
    "┌──────────────────────────────────────────────┐",
    "│  hello, curious person.                      │",
    "│  you found the console, so you read source.  │",
    "│  me too. the site's code is public:          │",
    "│  github.com/Jrkesari/Portfolio               │",
    "│                                              │",
    `│  ${site.email.padEnd(44)}│`,
    "└──────────────────────────────────────────────┘",
  ].join("\n");
  console.log(`%c${box}`, "font-family: ui-monospace, monospace; color: #d9661a; line-height: 1.25;");
  console.log("%ckeys: ⌘K menu · t tl;dr · z sleep", "font-family: ui-monospace, monospace; color: #6b6556;");
}
