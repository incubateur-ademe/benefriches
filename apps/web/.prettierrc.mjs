import commonConfig from "../../.tooling/prettierrc.js";

const config = {
  ...commonConfig,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
  importOrder: ["<THIRD_PARTY_MODULES>", "^@/", "^[./]"],
  importOrderSeparation: true,
};

export default config;
