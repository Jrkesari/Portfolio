import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#F5F1EA",
        accent: "#171717",
        "accent-light": "#EAE3D6",
        "accent-dark": "#0A0A0A",
        border: "#E2DBCC",
        muted: "#6F6A60",
        surface: "#EDE7DA",
        cream: "#FBF9F4",
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
