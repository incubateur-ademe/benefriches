import eslint from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import jestPlugin from "eslint-plugin-jest";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  eslintConfigPrettier,
  {
    plugins: {
      ["@typescript-eslint"]: tseslint.plugin,
      ["jest"]: jestPlugin,
    },
  },
  { ignores: ["node_modules/", "dist/"] },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
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
  // define jest globals and recommended rules for all test files
  {
    files: ["**/*spec.ts"],
    ...jestPlugin.configs["flat/recommended"],
  },
);
