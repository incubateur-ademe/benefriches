// oxlint-disable no-console
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { buildAdemeScriptComputeImpactsUseCase } from "../ademeScriptDeps";
import {
  ADEME_IMPACTS_CSV_HEADERS,
  buildAdemeImpactsCsvRow,
  escapeCsvValue,
} from "../export/ademeImpactsCsvRow";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const userId = process.argv[2];
const outputPath =
  process.argv[3] ?? path.resolve(import.meta.dirname, "../ademe-impacts-export.csv");

if (!userId) {
  console.error(
    "Usage: pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/export-ademe-impacts-csv.ts <user-id> [output-csv-path]",
  );
  process.exit(1);
}

// oxlint-disable-next-line typescript/no-floating-promises
(async () => {
  console.info("Connecting to database...");
  const db = knex(knexConfig);

  try {
    const projects = await db("reconversion_projects")
      .select("reconversion_projects.id", "reconversion_projects.name")
      .join("sites", "sites.id", "reconversion_projects.related_site_id")
      .where("sites.created_by", userId)
      .orderBy("reconversion_projects.created_at");

    console.info(`Found ${projects.length} projects for user ${userId}`);

    const computeImpactsUseCase = buildAdemeScriptComputeImpactsUseCase(db);

    const csvLines: string[] = [ADEME_IMPACTS_CSV_HEADERS.map(escapeCsvValue).join(";")];

    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      try {
        const result = await computeImpactsUseCase.execute({
          reconversionProjectId: project.id as string,
          evaluationPeriodInYears: 50,
        });

        if (!result.isSuccess()) {
          console.error(`❌ ${project.name}: ${result.getError()}`);
          errorCount++;
          continue;
        }

        const resultData = result.getData();
        const row = buildAdemeImpactsCsvRow(
          resultData.relatedSiteName,
          project.name as string,
          resultData,
        );
        csvLines.push(row.map(escapeCsvValue).join(";"));
        successCount++;
        console.info(`✅ ${project.name}`);
      } catch (error) {
        console.error(
          `❌ ${project.name}: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        errorCount++;
      }
    }

    const resolvedOutputPath = path.resolve(outputPath);
    fs.writeFileSync(resolvedOutputPath, csvLines.join("\n"), "utf-8");
    console.info(`\n📊 CSV exported to: ${resolvedOutputPath}`);
    console.info(`   ${successCount} projects exported, ${errorCount} errors`);
  } catch (error) {
    process.exitCode = 1;
    console.error("Fatal error:", error);
  } finally {
    await db.destroy();
  }
})();
