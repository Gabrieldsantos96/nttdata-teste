/// <reference types="vite/client"/>
/// <reference types="vite-plugin-svgr/client" />

import { defineConfig } from "vite";
import plugin from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import svgr from "vite-plugin-svgr";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

const BACKEND_URL = "http://ambev.developerevaluation.server:8080";

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
    svgr(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
