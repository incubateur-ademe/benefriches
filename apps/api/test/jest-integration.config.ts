import baseConfig from "./jest.config";

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  testMatch: ["<rootDir>/src/**/*.integration-spec.ts"],
  globalSetup: "<rootDir>/test/integration-tests-setup.ts",
  globalTeardown: "<rootDir>/test/integration-tests-teardown.ts",
};
