import swc from "unplugin-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: ["./src/**/*.spec.ts"],
    root: "./",
  },
  plugins: [
    // swc is used because vitest uses esbuild internally, which does not fully support decorators
    // see https://github.com/vitest-dev/vitest/issues/708
    // https://github.com/nestjs/nest/issues/9228
    // https://docs.nestjs.com/recipes/swc#vitest
    swc.vite(),
    tsconfigPaths(),
  ],
});
