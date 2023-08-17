/* eslint-env node */
import fs from "fs";
import path from "path";

import yaml from "yaml";
import Engine from "publicodes";

const rulesDir = "./rules";
const outDir = "./dist";

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

fs.readdirSync(rulesDir).forEach((filename) => {
  const filePath = path.join(rulesDir, filename);
  const rules = yaml.parse(fs.readFileSync(filePath, "utf8"));
  const names = Object.keys(new Engine(rules).getParsedRules());
  const jsString = `export default ${JSON.stringify(rules, null, 2)}`;
  fs.writeFileSync(path.resolve(outDir, `${path.parse(filename).name}.js`), jsString);
  fs.writeFileSync(
    path.resolve(outDir, "names.ts"),
    `\nexport type Names = ${names.map((name) => `"${name}"`).join("\n  | ")}\n`
  );
});
