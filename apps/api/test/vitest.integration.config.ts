import { defineConfig } from "vitest/config";

import testconfig from "./vitest.config";

export default defineConfig({
  ...testconfig,
  test: {
    ...testconfig.test,
    include: ["./src/**/*.integration-spec.ts"],
    setupFiles: ["./test/integration-tests-global-hooks.ts"],
    globalSetup: ["./test/integration-tests-setup.ts"],
    fileParallelism: false,
  },
});
