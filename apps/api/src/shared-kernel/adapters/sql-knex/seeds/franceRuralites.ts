import { Knex } from "knex";

import { readFranceRuralitesCsvData } from "../scripts/read-france-ruralites-csv";

// Imports the rural communes from the official France Ruralités Revitalisation
// list. Data source + format: see apps/api/data/france-ruralites/README.md
export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("france_ruralites").del();

  // Intentionally NOT wrapped in try/catch: let CSV-read or insert errors
  // propagate so `knex seed:run` exits non-zero with the real error instead of
  // reporting success on a half-failed seed.
  const data = await readFranceRuralitesCsvData();
  const inserted = await knex.batchInsert("france_ruralites", data, 1000).returning("city_code");

  console.log(`${inserted.length} france_ruralites inserted`);
}
