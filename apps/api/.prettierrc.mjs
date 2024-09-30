import commonConfig from "../../.tooling/prettierrc.js";

const config = {
  ...commonConfig,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["<THIRD_PARTY_MODULES>", "^src", "^[./]"],
  importOrderSeparation: true,
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
};

export default config;
