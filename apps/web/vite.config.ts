import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig, loadEnv } from "vite";

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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const serverProxyConfig = {
    "/api": {
      target: env.API_HOST,
      changeOrigin: true,
    },
  };

  return {
    base: "/", // make sure all assets are fetched from '/', even when route path is overwritten (like /embed/* routes)
    plugins: [tailwindcss(), react(), interceptEmbedRouting()],

    // Vite expects local dependencies to be exported as ES Modules but shared is built as CommonJS
    // https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
    optimizeDeps: {
      include: ["shared"],
    },
    build: {
      rollupOptions: {
        input: {
          embed: resolve(__dirname, "embed.html"),
          main: resolve(__dirname, "index.html"),
        },
      },
      commonjsOptions: {
        include: [/shared/, /node_modules/],
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
      host: true, // needed for the Docker Container port mapping to work
      strictPort: true,
      port: 3000, // you can replace this port with any port
      proxy: serverProxyConfig,
    },
    resolve: {
      alias: [{ find: "@", replacement: "/src" }],
    },
    test: {
      environment: "jsdom",
      setupFiles: ["./src/test/setupTestEnv.ts"],
    },
  };
});
