import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import { SqlFranceRuralite } from "../tableTypes";

// A commune is considered rural when its FRR classification is anything other
// than "Non classée" (e.g. "FRR socle", "FRR+", "FRR bénéficiaire"...).
// Source, file format and full classification list are documented in
// apps/api/data/france-ruralites/README.md
const NON_RURAL_CLASSIFICATION = "Non classée";

export const readFranceRuralitesCsvData = () => {
  const dataPath = path.resolve(
    __dirname,
    "./../../../../../data/france-ruralites/liste-communes-FRR-juillet2025.csv",
  );
  const HEADER = "Code_insee;Departement;Commune;Classement FRR et FRR+ au 10 juillet 2025;";

  return new Promise<SqlFranceRuralite[]>((resolve, reject) => {
    const readStream = fs.createReadStream(dataPath, "utf-8");
    const rl = readline.createInterface({ input: readStream });
    const data: SqlFranceRuralite[] = [];

    rl.on("line", (rawLine) => {
      // The source file is UTF-8 with CRLF line endings and may carry a BOM on
      // the first line, so normalize before parsing.
      const line = rawLine.replace(/^\uFEFF/, "").replace(/\r$/, "");
      if (line === HEADER || line === "") {
        return;
      }
      const [cityCode, , , classification] = line.split(";") as [string, string, string, string];

      // Keep only rural communes (skip "Non classée" and any malformed row).
      if (!cityCode || !classification || classification === NON_RURAL_CLASSIFICATION) {
        return;
      }
      data.push({ city_code: cityCode });
    });
    rl.on("error", (error: Error) => {
      reject(error);
    });
    rl.on("close", () => {
      console.log(`\n📊 France Ruralités: ${data.length} communes rurales trouvées`);
      resolve(data);
    });
  });
};
