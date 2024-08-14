import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

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
    plugins: [react()],
    // Vite expects local dependencies to be exported as ES Modules but shared is built as CommonJS
    // https://vitejs.dev/guide/dep-pre-bundling#monorepos-and-linked-dependencies
    optimizeDeps: {
      include: ["shared"],
    },
    build: {
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
