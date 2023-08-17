/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

/** @type {import('jest').Config} */
const config = {
  rootDir: "../",
  // Allows jest to resolve relative paths in imports (import { User } from "src/users/domain/models/user")
  modulePaths: ["<rootDir>"],

  clearMocks: true,

  /* Coverage */

  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: false,
  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  // coverageDirectory: undefined,

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "/node_modules/"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  /* Deprecation */

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: true,

  /* Modules resolution */
  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ["<rootDir>/node_modules"],

  // The number of seconds after which a test is considered as slow and reported as such in the results.
  slowTestThreshold: 3,

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["<rootDir>/src/**/*.spec.ts"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
};

export default config;
