import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import vitest from 'eslint-plugin-vitest';
import nodePlugin from "eslint-plugin-n";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from 'eslint/config';

export default defineConfig(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      ["@typescript-eslint"]: tseslint.plugin,
      ["eslint-plugin-n"]: nodePlugin,
      ['vitest']: vitest,
    },
  },
  { ignores: ["node_modules/", "dist/"] },
  {
    rules: {
      "eslint-plugin-n/prefer-node-protocol": ["error"],
    },
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname, 
        project: true,
      },
      globals: globals.node,
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
    rules: {
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/consistent-type-definitions": "off",
      "@typescript-eslint/restrict-template-expressions": [2, { allowNumber: true }],
      // needed for NestJS empty module classes
      "@typescript-eslint/no-extraneous-class": ["error", { allowWithDecorator: true }],
    },
  },
  // ignore typechecking for non-ts files
  {
    files: ["**/*.{cjs,mjs,js}"],
    extends: [tseslint.configs.disableTypeChecked],
  },
  // define vitest globals and recommended rules for all test files
  {
    files: ["**/*spec.ts"],
    rules: {
      ...vitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
  },
);
