/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  rootDir: "./",
  // Allows jest to resolve relative paths in imports (import { User } from "src/users/domain/models/user")
  modulePaths: ["<rootDir>"],
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 3,

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/src/**/*.spec.ts"],

  preset: "ts-jest",
};

export default config;
