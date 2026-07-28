// oxlint-disable no-console
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import type { TResult } from "src/shared-kernel/result";

import {
  buildAdemeScriptComputeImpactsUseCase,
  buildAdemeScriptGetReconversionProjectFeaturesUseCase,
  buildAdemeScriptGetSiteByIdUseCase,
} from "../ademeScriptDeps";
import { escapeCsvValue } from "../export/ademeImpactsCsvRow";
import {
  REFERENTIEL_PROJECTS_CSV_HEADERS,
  buildReferentielProjectsCsvRow,
} from "../export/referentielProjectsCsvRow";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  // quiet: dotenv's startup banner would otherwise go to stdout and corrupt the CSV
  configDotenv({ path: dotEnvPath, quiet: true });
}

const EVALUATION_PERIOD_IN_YEARS = 50;

function logProgress(message: string): void {
  process.stderr.write(`${message}\n`);
}

// A descriptive lookup must never cost us the row: the impacts are the expensive part.
// Query adapters signal bad data by throwing (e.g. an urban zone site with no features
// row), so a throw degrades to blank cells exactly like an unsuccessful Result.
async function lookupOrBlank<T>(
  projectLabel: string,
  what: string,
  run: () => Promise<TResult<T>>,
): Promise<T | undefined> {
  try {
    const result = await run();
    if (result.isSuccess()) {
      return result.getData();
    }
    logProgress(`⚠️  ${projectLabel}: ${what} lookup failed (${result.getError()}), cells blank`);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    logProgress(`⚠️  ${projectLabel}: ${what} lookup failed (${reason}), cells blank`);
  }
  return undefined;
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
      .andWhere("reconversion_projects.status", "active")
      .orderBy("reconversion_projects.created_at");

    logProgress(`Found ${projects.length} custom, active reconversion projects`);

    const computeImpactsUseCase = buildAdemeScriptComputeImpactsUseCase(db);
    const getSiteByIdUseCase = buildAdemeScriptGetSiteByIdUseCase(db);
    const getReconversionProjectFeaturesUseCase =
      buildAdemeScriptGetReconversionProjectFeaturesUseCase(db);

    process.stdout.write(`${REFERENTIEL_PROJECTS_CSV_HEADERS.map(escapeCsvValue).join(";")}\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const project of projects) {
      const projectId = project.id as string;
      const projectName = project.name as string;
      const createdBy = project.created_by as string;
      const createdAt = project.created_at as Date;

      try {
        const impactsResult = await computeImpactsUseCase.execute({
          reconversionProjectId: projectId,
          evaluationPeriodInYears: EVALUATION_PERIOD_IN_YEARS,
        });

        if (!impactsResult.isSuccess()) {
          logProgress(`❌ ${projectId} (${projectName}): ${impactsResult.getError()}`);
          errorCount++;
          continue;
        }

        const computedImpacts = impactsResult.getData();

        const siteData = await lookupOrBlank(`${projectId} (${projectName})`, "site", () =>
          getSiteByIdUseCase.execute({ siteId: computedImpacts.relatedSiteId }),
        );
        const projectFeatures = await lookupOrBlank(
          `${projectId} (${projectName})`,
          "project features",
          () => getReconversionProjectFeaturesUseCase.execute({ reconversionProjectId: projectId }),
        );

        const row = buildReferentielProjectsCsvRow(
          { createdBy, createdAt },
          computedImpacts,
          siteData?.site,
          projectFeatures,
        );
        process.stdout.write(`${row.map(escapeCsvValue).join(";")}\n`);
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
