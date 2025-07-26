import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const backendUrl =
  process.env.VITE_BACKEND_URL ||
  "http://ambev.developerevaluation.server:8080";

export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      generatedRouteTree: "./src/route-tree.gen.ts",
      routesDirectory: "./src/pages",
      routeToken: "layout",
    }),
    plugin(),
    tailwindcss(),
    svgr({
      include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "^/api": {
        target: backendUrl,
        secure: false,
      },
    },
    port: parseInt(process.env.DEV_SERVER_PORT || "5173"),
  },
});
