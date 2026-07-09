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

const EXTRA_HEADERS = ["Reconversion project ID", "Created by (user ID)", "Created at"];
const ALL_HEADERS = [...EXTRA_HEADERS, ...ADEME_IMPACTS_CSV_HEADERS];

function logProgress(message: string): void {
  process.stderr.write(`${message}\n`);
}

// oxlint-disable-next-line typescript/no-floating-promises
(async () => {
  logProgress("Connecting to database...");
  const db = knex(knexConfig);

  try {
    const projects = await db("reconversion_projects")
      .select(
        "reconversion_projects.id",
        "reconversion_projects.name",
        "reconversion_projects.created_by",
        "reconversion_projects.created_at",
      )
      .where("reconversion_projects.creation_mode", "custom")
      .orderBy("reconversion_projects.created_at");

    logProgress(`Found ${projects.length} custom reconversion projects`);

    const computeImpactsUseCase = buildAdemeScriptComputeImpactsUseCase(db);

    process.stdout.write(`${ALL_HEADERS.map(escapeCsvValue).join(";")}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      const projectId = project.id as string;
      const projectName = project.name as string;
      const createdBy = project.created_by as string;
      const createdAt = (project.created_at as Date).toISOString();

      try {
        const result = await computeImpactsUseCase.execute({
          reconversionProjectId: projectId,
          evaluationPeriodInYears: 50,
        });

        if (!result.isSuccess()) {
          logProgress(`❌ ${projectId} (${projectName}): ${result.getError()}`);
          errorCount++;
          continue;
        }

        const resultData = result.getData();
        const impactsRow = buildAdemeImpactsCsvRow(
          resultData.relatedSiteName,
          projectName,
          resultData,
        );
        const fullRow = [projectId, createdBy, createdAt, ...impactsRow];
        process.stdout.write(`${fullRow.map(escapeCsvValue).join(";")}\n`);
        successCount++;
        logProgress(`✅ ${projectId} (${projectName})`);
      } catch (error) {
        logProgress(
          `❌ ${projectId} (${projectName}): ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        errorCount++;
      }
    }

    logProgress(`\n📊 ${successCount} projects exported, ${errorCount} errors`);
  } catch (error) {
    process.exitCode = 1;
    logProgress(`Fatal error: ${error instanceof Error ? error.message : String(error)}`);
  } finally {
    await db.destroy();
  }
})();
