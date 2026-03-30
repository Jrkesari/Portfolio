import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#171717",
        "accent-light": "#EDE9E1",
        "accent-dark": "#0A0A0A",
        border: "#E5E5E5",
        muted: "#737373",
        surface: "#F0EDE6",
        cream: "#F7F4EE",
      },
      fontFamily: {
        sans: ["DM Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["DM Mono", "Fira Code", "Consolas", "monospace"],
      },
      letterSpacing: {
        tight: "-0.03em",
        tighter: "-0.04em",
      },
      maxWidth: {
        content: "720px",
      },
    },
  },
  plugins: [],
};

export default config;
