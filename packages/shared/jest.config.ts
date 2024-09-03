export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
  globals: { "ts-jest": { diagnostics: false } },
  transform: {},
};
