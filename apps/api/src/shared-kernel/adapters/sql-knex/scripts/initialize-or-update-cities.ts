import { configDotenv } from "dotenv";
import knex, { type Knex } from "knex";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";

import knexConfig from "../knexConfig";
import { SqlCity } from "../tableTypes";
import { readCitiesCsvData } from "./read-cities-csv";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const TABLE_NAME = "cities";
const CHUNK_SIZE = 1000;

const isDryRun = process.argv.includes("--dry-run");

type CityRow = Omit<SqlCity, "id">;

const ALDO_COLUMNS = [
  "aldo_zpc",
  "aldo_code_greco",
  "aldo_code_groupeser",
  "aldo_code_ser",
  "aldo_code_bassin_populicole",
] as const satisfies readonly (keyof CityRow)[];

const ZONAGE_COLUMNS = ["mte_zonage_abc"] as const satisfies readonly (keyof CityRow)[];

const OTHER_COLUMNS = [
  "name",
  "department",
  "region",
  "epci",
] as const satisfies readonly (keyof CityRow)[];

const COMPARABLE_COLUMNS = [
  ...OTHER_COLUMNS,
  ...ALDO_COLUMNS,
  ...ZONAGE_COLUMNS,
] as const satisfies readonly (keyof CityRow)[];

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

const isColumnEqual = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) || Array.isArray(b)) {
    const arrA = [...((a as string[]) ?? [])].toSorted();
    const arrB = [...((b as string[]) ?? [])].toSorted();
    return JSON.stringify(arrA) === JSON.stringify(arrB);
  }
  return (a ?? "") === (b ?? "");
};

const getChangedColumns = (existing: CityRow, incoming: CityRow): (keyof CityRow)[] =>
  COMPARABLE_COLUMNS.filter((col) => !isColumnEqual(existing[col], incoming[col]));

const isOnlyAmong = (
  changedColumns: (keyof CityRow)[],
  group: readonly (keyof CityRow)[],
): boolean => changedColumns.length > 0 && changedColumns.every((col) => group.includes(col));

const includesAny = (
  changedColumns: (keyof CityRow)[],
  group: readonly (keyof CityRow)[],
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
  chunk: CityRow[],
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

async function initializeOrUpdateCities() {
  const sqlConnection: Knex = knex(knexConfig);

  try {
    console.log(`🚀 Initialisation/mise à jour de la table \`${TABLE_NAME}\`...`);
    console.log(`📍 Environment: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`💽 Database: ${process.env.DATABASE_URL ? "Connected" : "Local"}`);
    if (isDryRun) console.log("🧪 Mode dry-run activé : aucune écriture ne sera effectuée.");

    const csvData = await readCitiesCsvData();
    if (csvData.length === 0) {
      console.log("⚠️ Pas de données à traiter - CSV vide");
      return;
    }

    const csvByCityCode = new Map(csvData.map((row) => [row.city_code, row]));

    const existingRows: (CityRow & { city_code: string })[] = await sqlConnection(
      TABLE_NAME,
    ).select("city_code", ...COMPARABLE_COLUMNS);
    const existingByCityCode = new Map(existingRows.map((row) => [row.city_code, row]));

    const toInsert: CityRow[] = [];
    const toUpdate: CityRow[] = [];
    const unchanged: CityRow[] = [];

    const updatesOnlyZonage: CityRow[] = [];
    const updatesOnlyAldo: CityRow[] = [];
    const updatesAldo: CityRow[] = [];
    const updatesZonage: CityRow[] = [];
    const updatesOther: CityRow[] = [];

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

      if (isOnlyAmong(changedColumns, ZONAGE_COLUMNS)) updatesOnlyZonage.push(row);
      if (isOnlyAmong(changedColumns, ALDO_COLUMNS)) updatesOnlyAldo.push(row);
      if (includesAny(changedColumns, ALDO_COLUMNS)) updatesAldo.push(row);
      if (includesAny(changedColumns, ZONAGE_COLUMNS)) updatesZonage.push(row);
      if (includesAny(changedColumns, OTHER_COLUMNS)) updatesOther.push(row);
    }

    const toDeleteCityCodes = existingRows
      .map((row) => row.city_code)
      .filter((cityCode) => !csvByCityCode.has(cityCode));

    console.log("\n📈 Diff calculé :");
    console.log(`   - Inchangées : ${unchanged.length}`);
    console.log(`   - À insérer  : ${toInsert.length}`);
    console.log(`   - À modifier : ${toUpdate.length}`);
    console.log(`       dont uniquement zonage ABC : ${updatesOnlyZonage.length}`);
    console.log(`       dont uniquement données aldo: ${updatesOnlyAldo.length}`);
    console.log(`       dont zonage ABC (total)     : ${updatesZonage.length}`);
    console.log(`       dont données aldo (total)   : ${updatesAldo.length}`);
    console.log(`       dont name/dep/region/epci   : ${updatesOther.length}`);
    console.log(`   - À supprimer: ${toDeleteCityCodes.length}`);

    logCityCodes(
      "Nouvelles communes",
      toInsert.map((r) => r.city_code),
    );
    logCityCodes(
      "Communes modifiées",
      toUpdate.map((r) => r.city_code),
    );
    logCityCodes(
      "  dont uniquement zonage ABC",
      updatesOnlyZonage.map((r) => r.city_code),
    );
    logCityCodes(
      "  dont uniquement données aldo",
      updatesOnlyAldo.map((r) => r.city_code),
    );
    logCityCodes("Communes à supprimer", toDeleteCityCodes);

    if (isDryRun) {
      console.log("\n🧪 Dry-run terminé, aucune écriture effectuée.");
      return;
    }

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

void initializeOrUpdateCities();
