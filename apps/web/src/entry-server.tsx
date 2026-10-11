// Renders one route to HTML at build time, for scripts/prerender.ts. Never shipped to the browser.
import { createMemoryHistory, createRouter, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { routeTree } from "./routeTree.gen";

export async function render(url: string) {
  const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [url] }), isServer: true });
  await router.load();
  return { html: renderToString(<RouterProvider router={router} />) };
}
