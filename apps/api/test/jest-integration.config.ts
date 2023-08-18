import type { JestConfigWithTsJest } from "ts-jest";
import baseConfig from "./jest.config";

const config: JestConfigWithTsJest = {
  ...baseConfig,
  testMatch: ["<rootDir>/src/**/*.integration-spec.ts"],
  globalSetup: "<rootDir>/test/integration-tests-setup.ts",
  globalTeardown: "<rootDir>/test/integration-tests-teardown.ts",
};

export default config;
