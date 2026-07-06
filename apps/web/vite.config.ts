import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const interceptEmbedRouting = () => {
  return {
    name: "intercept-embed-routes-middleware",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const reqUrl = req.originalUrl ?? req.url;
        // Redirect all /embed/* requests to embed.html ; achieved with nginx in production
        if (reqUrl.startsWith("/embed/")) {
          req.url = "/embed.html";
        }
        next();
      });
    },
  };
};

// https://vitejs.dev/config/
// NOTE: kept as an arrow function with an implicit object return
// so Vitest's `coverage.thresholds.autoUpdate` can parse and rewrite
// this file with magicast — it only supports `defineConfig(() => ({ ... }))`.
export default defineConfig(({ mode }) => ({
  base: "/", // make sure all assets are fetched from '/', even when route path is overwritten (like /embed/* routes)
  plugins: [
    nodePolyfills({
      include: ["buffer"], // only polyfill buffer (needed by react-pdf)
    }),
    tailwindcss(),
    react(),
    interceptEmbedRouting(),
  ],
  build: {
    rollupOptions: {
      input: {
        embed: resolve(__dirname, "embed.html"),
        main: resolve(__dirname, "index.html"),
      },
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 3000, // you can replace this port with any port
    proxy: {
      "/api": {
        target: loadEnv(mode, process.cwd(), "").API_HOST,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: [{ find: "@", replacement: "/src" }],
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setupTestEnv.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/__tests__/**",
        "**/test/**",
        "**/*.d.ts",
        "**/*.types.ts",
        "**/InMemory*.ts",
        "src/main.tsx",
        "src/app/App.tsx",
        "src/features/FeaturesApp.tsx",
        "src/embed.tsx",
      ],
      thresholds: {
        // Default/global fallback (e.g. a brand-new feature folder before its glob is added below).
        lines: 80.11,
        statements: 79.79,
        functions: 77.96,
        branches: 65.71,
        autoUpdate: true,
        "src/features/analytics/**": { lines: 100, statements: 100, functions: 100, branches: 100 },
        "src/features/app-settings/**": {
          lines: 100,
          statements: 100,
          functions: 100,
          branches: 100,
        },
        "src/features/archive-project/**": { lines: 0, statements: 0, functions: 0, branches: 0 },
        "src/features/archive-site/**": { lines: 0, statements: 0, functions: 0, branches: 0 },
        "src/features/create-project/**": {
          lines: 81.24,
          statements: 80.62,
          functions: 77.57,
          branches: 62.22,
        },
        "src/features/create-site/**": {
          lines: 91,
          statements: 90.78,
          functions: 85.1,
          branches: 74.75,
        },
        "src/features/my-evaluations/**": {
          lines: 48.14,
          statements: 50,
          functions: 25,
          branches: 0,
        },
        "src/features/onboarding/**": {
          lines: 70,
          statements: 69.87,
          functions: 57.57,
          branches: 70,
        },
        "src/features/projects/**": {
          lines: 74.48,
          statements: 74.09,
          functions: 71.87,
          branches: 55.26,
        },
        "src/features/public-pages/**": { lines: 0, statements: 0, functions: 0, branches: 0 },
        "src/features/reconversion-compatibility/**": {
          lines: 92.2,
          statements: 92.68,
          functions: 95.23,
          branches: 76.47,
        },
        "src/features/sites/**": {
          lines: 86.66,
          statements: 87.23,
          functions: 89.47,
          branches: 71.42,
        },
        "src/features/support/**": { lines: 100, statements: 100, functions: 100, branches: 100 },
        "src/features/update-project/**": {
          lines: 72.41,
          statements: 70.94,
          functions: 28.57,
          branches: 74.02,
        },
        "src/features/user-feature-alerts/**": {
          lines: 12.63,
          statements: 12.5,
          functions: 8.33,
          branches: 0,
        },
        "src/shared/**": { lines: 79.89, statements: 79.62, functions: 80.55, branches: 69.01 },
        "src/app/**": { lines: 90, statements: 90.24, functions: 91.66, branches: 0 },
        "src/libs/**": { lines: 100, statements: 100, functions: 100, branches: 100 },
      },
    },
  },
}));
