import { configDotenv } from "dotenv";
import fs from "fs";
import knex, { Knex } from "knex";
import path from "node:path";
import readline from "readline";

import knexConfig from "../../sql-knex/knexConfig";
import { CityStats } from "../tableTypes";
import { readCityStatsCsvData } from "./read-city-stats-csv";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const CHUNK_SIZE = 1000;

const askForConfirmation = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "\n❓ Voulez-vous continuer avec l'initialisation des données ? (y/N): ",
      (answer) => {
        rl.close();
        const confirmation = answer.toLowerCase().trim();
        resolve(
          confirmation === "y" ||
            confirmation === "yes" ||
            confirmation === "o" ||
            confirmation === "oui",
        );
      },
    );
  });
};

const chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

const processChunk = async (
  sqlConnection: Knex,
  chunk: CityStats[],
  chunkIndex: number,
): Promise<void> => {
  try {
    console.log(`\nTraitement du chunk ${chunkIndex + 1} (${chunk.length} enregistrements)...`);

    await sqlConnection
      .insert(chunk)
      .into("city_stats")
      .onConflict("city_code")
      .merge([
        "da_name",
        "da_population",
        "da_surface_ha",
        "dvf_nbtrans",
        "dvf_pxm2_median",
        "dvf_surface_median",
        "dvf_nbtrans_cod111",
        "dvf_pxm2_median_cod111",
        "dvf_nbtrans_cod121",
        "dvf_pxm2_median_cod121",
        "dvf_surface_median_cod111",
        "dvf_surface_median_cod121",
        "updated_at",
      ]);

    console.log(`✅ Chunk ${chunkIndex + 1} traité avec succès`);
  } catch (error) {
    console.error(`❌ Erreur lors du traitement du chunk ${chunkIndex + 1}:`, error);
    throw error;
  }
};

async function initializeCityStatsData() {
  const sqlConnection: Knex = knex(knexConfig);
  let totalProcessed = 0;
  let totalInserted = 0;
  let totalUpdated = 0;

  try {
    console.log("🚀 Initialisation des données `city_stats`...");
    console.log(`📍 Environment: ${process.env.NODE_ENV ?? "development"}`);
    console.log(`💽 Database: ${process.env.DATABASE_URL ? "Connected" : "Local"}`);

    const shouldContinue = await askForConfirmation();

    if (!shouldContinue) {
      console.log("❌ Opération annulée par l'utilisateur.");
      return;
    }

    console.log("✅ Confirmation received, proceeding with data initialization...\n");

    const data = await readCityStatsCsvData();

    if (data.length === 0) {
      console.log("⚠️ Pas de données à traiter - CSV vide");
      return;
    }

    const chunks = chunkArray(data, CHUNK_SIZE);
    console.log(
      `\n📦 Données divisées en ${chunks.length} chunks de ${CHUNK_SIZE} enregistrements chacun`,
    );

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];

      if (chunk) {
        try {
          const existingRecords = await sqlConnection("city_stats")
            .whereIn(
              "city_code",
              chunk.map((record) => record.city_code),
            )
            .select("city_code");

          const existingCityCodes = new Set(existingRecords.map((r) => r.city_code));
          const insertCount = chunk.filter(
            (record) => !existingCityCodes.has(record.city_code),
          ).length;
          const updateCount = chunk.length - insertCount;

          await processChunk(sqlConnection, chunk, i);

          totalProcessed += chunk.length;
          totalInserted += insertCount;
          totalUpdated += updateCount;

          console.log(
            `\n⏳ Progression: ${totalProcessed}/${data.length} enregistrements traités (${Math.round((totalProcessed / data.length) * 100)}%)`,
          );

          // Pause pour éviter de surcharger la DB
          if (i < chunks.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
        } catch (chunkError) {
          console.error(
            `❌ Erreur de traitement du chunk ${i + 1}, traitement du prochain chunk...`,
            chunkError,
          );
          // On essaye de traiter la suite plutôt que de tout stopper
        }
      }
    }

    console.log("\n✅ Traitement terminé !\n");
    console.log(`📈 Récapitulatif:`);
    console.log(`   - Total: ${totalProcessed} enregistrements traités`);
    console.log(`   - Nouveau: ${totalInserted} enregistrements`);
    console.log(`   - Mis à jour: ${totalUpdated} enregistrements`);

    const totalInDatabase = await sqlConnection("city_stats").count({ count: "*" });
    console.log(`\n🗄️ Nombre de lignes dans la table \`city_stats\`: ${totalInDatabase[0]?.count}`);
  } catch (err: unknown) {
    console.error(`\n❌ Fatal error: ${err as Error}`);
    throw err;
  } finally {
    await sqlConnection.destroy();
    console.log("\n🔌 Fermeture de la connexion à la base de données.");
  }
}

void initializeCityStatsData();
