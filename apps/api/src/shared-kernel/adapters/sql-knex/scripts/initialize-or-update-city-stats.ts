import { configDotenv } from "dotenv";
import knex, { type Knex } from "knex";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import knexConfig from "../../sql-knex/knexConfig";
import { CityStats } from "../tableTypes";
import { readCityStatsCsvData } from "./read-city-stats-csv";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const TABLE_NAME = "city_stats";
const CHUNK_SIZE = 1000;

type StatsRow = CityStats;

const DA_COLUMNS = [
  "da_name",
  "da_population",
  "da_surface_ha",
] as const satisfies readonly (keyof StatsRow)[];

const DVF_COLUMNS = [
  "dvf_nbtrans",
  "dvf_pxm2_median",
  "dvf_surface_median",
  "dvf_nbtrans_cod111",
  "dvf_pxm2_median_cod111",
  "dvf_nbtrans_cod121",
  "dvf_pxm2_median_cod121",
  "dvf_surface_median_cod111",
  "dvf_surface_median_cod121",
  "dvf_nbtrans_terrain",
  "dvf_pxm2_median_terrain",
  "dvf_surface_median_terrain",
] as const satisfies readonly (keyof StatsRow)[];

const COMPARABLE_COLUMNS = [
  ...DA_COLUMNS,
  ...DVF_COLUMNS,
] as const satisfies readonly (keyof StatsRow)[];

const MERGE_COLUMNS = [...COMPARABLE_COLUMNS, "updated_at"] as const;

const askForConfirmation = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(message, (answer) => {
      rl.close();
      const confirmation = answer.toLowerCase().trim();
      resolve(
        confirmation === "y" ||
          confirmation === "yes" ||
          confirmation === "o" ||
          confirmation === "oui",
      );
    });
  });
};

const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const isColumnEqual = (a: number | string | undefined, b: number | string | undefined): boolean => {
  if (a === null || a === undefined || a === "") return b === null || b === undefined || b === "";
  if (b === null || b === undefined || b === "") return false;

  const numA = Number(a);
  const numB = Number(b);
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA === numB;

  return String(a) === String(b);
};

const getChangedColumns = (existing: StatsRow, incoming: StatsRow): (keyof StatsRow)[] =>
  COMPARABLE_COLUMNS.filter((col) => !isColumnEqual(existing[col], incoming[col]));

const includesAny = (
  changedColumns: (keyof StatsRow)[],
  group: readonly (keyof StatsRow)[],
): boolean => changedColumns.some((col) => group.includes(col));

const logCityCodes = (label: string, codes: string[], max = 30): void => {
  if (codes.length === 0) return;
  console.log(
    `   ${label} (${codes.length}) : ${codes.slice(0, max).join(", ")}${
      codes.length > max ? `, ... (+${codes.length - max})` : ""
    }`,
  );
};

const processUpsertChunk = async (
  sqlConnection: Knex,
  chunk: StatsRow[],
  chunkIndex: number,
  totalChunks: number,
): Promise<void> => {
  console.log(
    `\nTraitement du chunk ${chunkIndex + 1}/${totalChunks} (${chunk.length} enregistrements)...`,
  );

  const chunkWithTimestamp = chunk.map((row) => ({
    ...row,
    updated_at: sqlConnection.fn.now(),
  }));

  await sqlConnection
    .insert(chunkWithTimestamp)
    .into(TABLE_NAME)
    .onConflict("city_code")
    .merge([...MERGE_COLUMNS]);

  console.log(`✅ Chunk ${chunkIndex + 1}/${totalChunks} traité avec succès`);
};

const processDeleteChunk = async (
  sqlConnection: Knex,
  cityCodes: string[],
  chunkIndex: number,
  totalChunks: number,
): Promise<void> => {
  console.log(
    `\nSuppression du chunk ${chunkIndex + 1}/${totalChunks} (${cityCodes.length} lignes)...`,
  );

  await sqlConnection(TABLE_NAME).whereIn("city_code", cityCodes).delete();

  console.log(`✅ Chunk ${chunkIndex + 1}/${totalChunks} supprimé avec succès`);
};

async function initializeOrUpdateCityStats() {
  const sqlConnection: Knex = knex(knexConfig);

  try {
    console.log(`🚀 Initialisation/mise à jour de la table \`${TABLE_NAME}\`...`);
    console.log(`📍 Environment: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`💽 Database: ${process.env.DATABASE_URL ? "Connected" : "Local"}`);

    const csvData = await readCityStatsCsvData();
    if (csvData.length === 0) {
      console.log("⚠️ Pas de données à traiter - CSV vide");
      return;
    }

    const csvByCityCode = new Map(csvData.map((row) => [row.city_code, row]));

    const existingRows: StatsRow[] = await sqlConnection(TABLE_NAME).select(
      "city_code",
      ...COMPARABLE_COLUMNS,
    );
    const existingByCityCode = new Map(existingRows.map((row) => [row.city_code, row]));

    const toInsert: StatsRow[] = [];
    const toUpdate: StatsRow[] = [];
    const unchanged: StatsRow[] = [];

    const updatesDa: StatsRow[] = [];
    const updatesDvf: StatsRow[] = [];

    for (const row of csvData) {
      const existing = existingByCityCode.get(row.city_code);
      if (!existing) {
        toInsert.push(row);
        continue;
      }

      const changedColumns = getChangedColumns(existing, row);
      if (changedColumns.length === 0) {
        unchanged.push(row);
        continue;
      }

      toUpdate.push(row);

      if (includesAny(changedColumns, DA_COLUMNS)) updatesDa.push(row);
      if (includesAny(changedColumns, DVF_COLUMNS)) updatesDvf.push(row);
    }

    const toDeleteCityCodes = existingRows
      .map((row) => row.city_code)
      .filter((cityCode) => !csvByCityCode.has(cityCode));

    console.log("\n📈 Diff calculé :");
    console.log(`   - Inchangées : ${unchanged.length}`);
    console.log(`   - À insérer  : ${toInsert.length}`);
    console.log(`   - À modifier : ${toUpdate.length}`);
    console.log(`       dont données da  : ${updatesDa.length}`);
    console.log(`       dont données dvf : ${updatesDvf.length}`);
    console.log(`   - À supprimer: ${toDeleteCityCodes.length}`);

    logCityCodes(
      "Nouvelles communes",
      toInsert.map((r) => r.city_code),
    );
    logCityCodes(
      "Communes modifiées",
      toUpdate.map((r) => r.city_code),
    );
    logCityCodes("Communes à supprimer", toDeleteCityCodes);

    if (toInsert.length === 0 && toUpdate.length === 0 && toDeleteCityCodes.length === 0) {
      console.log("\n✅ Rien à faire, la table est déjà à jour.");
      return;
    }

    const shouldContinue = await askForConfirmation(
      "\n❓ Voulez-vous appliquer ces changements en base ? (y/N): ",
    );

    if (!shouldContinue) {
      console.log("❌ Opération annulée par l'utilisateur.");
      return;
    }

    console.log("✅ Confirmation reçue, application des changements...\n");

    const toUpsert = [...toInsert, ...toUpdate];
    const upsertChunks = chunkArray(toUpsert, CHUNK_SIZE);

    for (let i = 0; i < upsertChunks.length; i++) {
      const chunk = upsertChunks[i];
      if (!chunk) continue;

      try {
        await processUpsertChunk(sqlConnection, chunk, i, upsertChunks.length);
      } catch (chunkError) {
        console.error(
          `❌ Erreur de traitement du chunk ${i + 1}, traitement du prochain chunk...`,
          chunkError,
        );
      }
    }

    const deleteChunks = chunkArray(toDeleteCityCodes, CHUNK_SIZE);

    for (let i = 0; i < deleteChunks.length; i++) {
      const chunk = deleteChunks[i];
      if (!chunk) continue;

      try {
        await processDeleteChunk(sqlConnection, chunk, i, deleteChunks.length);
      } catch (chunkError) {
        console.error(
          `❌ Erreur de suppression du chunk ${i + 1}, traitement du prochain chunk...`,
          chunkError,
        );
      }
    }

    console.log("\n✅ Traitement terminé !\n");
    console.log(`📈 Récapitulatif:`);
    console.log(`   - Insérées  : ${toInsert.length}`);
    console.log(`   - Modifiées : ${toUpdate.length}`);
    console.log(`   - Supprimées: ${toDeleteCityCodes.length}`);
    console.log(`   - Inchangées: ${unchanged.length}`);

    const totalInDatabase = await sqlConnection(TABLE_NAME).count({ count: "*" });
    console.log(
      `\n🗄️ Nombre de lignes dans la table \`${TABLE_NAME}\`: ${totalInDatabase[0]?.count}`,
    );
  } catch (err: unknown) {
    console.error(`\n❌ Fatal error:`, err);
    throw err;
  } finally {
    await sqlConnection.destroy();
    console.log("\n🔌 Fermeture de la connexion à la base de données.");
  }
}

void initializeOrUpdateCityStats();
