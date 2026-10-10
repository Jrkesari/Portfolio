import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // Must run before the React plugin. autoCodeSplitting lazy-loads each route.
    tanstackRouter({
      target: "react",
      routesDirectory: "./src/routes",
      autoCodeSplitting: true,
      // Loaders ride with their components, so a page's text doesn't sit in the entry chunk.
      codeSplittingOptions: {
        defaultBehavior: [["loader", "component"], ["errorComponent"], ["notFoundComponent"]],
      },
    }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
