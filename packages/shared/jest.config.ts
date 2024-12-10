import { JestConfigWithTsJest, createDefaultPreset as tsTransformPreset } from "ts-jest";

const config: JestConfigWithTsJest = {
  ...tsTransformPreset(),
  testEnvironment: "node",
  testMatch: ["<rootDir>/**/*.spec.ts"],
  testPathIgnorePatterns: ["/node_modules/"],
};

export default config;
