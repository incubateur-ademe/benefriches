/* eslint-env node */

module.exports = {
  root: true,
  env: {
    node: true,
    es2020: true,
    "jest/globals": true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked",
    "plugin:jest/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/prefer-ts-expect-error": "error",
    "@typescript-eslint/prefer-readonly": "error",
    "@typescript-eslint/member-ordering": "error",
    "@typescript-eslint/consistent-type-definitions": "off",
    // needed for NestJS empty module classes
    "@typescript-eslint/no-extraneous-class": [
      "error",
      { allowWithDecorator: true },
    ],
  },
};
