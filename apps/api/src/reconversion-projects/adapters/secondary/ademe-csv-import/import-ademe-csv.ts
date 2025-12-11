// oxlint-disable no-console
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";

import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlSiteRepository } from "src/sites/adapters/secondary/site-repository/SqlSiteRepository";

import { SqlCityStatsQuery } from "../queries/city-stats/SqlCityStatsQuery";
import { SqlReconversionProjectImpactsQuery } from "../queries/reconversion-project-impacts/SqlReconversionProjectImpactsQuery";
import { SqlSiteImpactsQuery } from "../queries/site-impacts/SqlSiteImpactsQuery";
import { SqlReconversionProjectRepository } from "../repositories/reconversion-project/SqlReconversionProjectRepository";
import { BanAddressSearchGateway } from "./BaseAdresseNationaleClient";
import { importAdemeProjects } from "./importAdemeProjects";

const dotEnvPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(dotEnvPath)) {
  configDotenv({ path: dotEnvPath });
}

const csvPath = process.argv[2];
const userId = process.argv[3];
const includeDepartmentsArg = process.argv[4];

if (!csvPath || !userId) {
  console.error(
    "Usage: npx tsx apps/api/src/reconversion-projects/adapters/secondary/ademe-csv-import/import-ademe-csv.ts <csv-path> <user-id>",
  );
  console.error("\nExample:");
  console.error(
    '  npx tsx apps/api/src/reconversion-projects/adapters/secondary/ademe-csv-import/import-ademe-csv.ts ./ademe-projects.csv "user-123"',
  );
  process.exit(1);
}

// oxlint-disable-next-line typescript/no-floating-promises
(async () => {
  console.info("Connecting to database...");
  const db = knex(knexConfig);

  try {
    const sitesRepository = new SqlSiteRepository(db);
    const reconversionProjectRepository = new SqlReconversionProjectRepository(db);
    const addressApi = new BanAddressSearchGateway();

    // compute impacts dependencies
    const reconversionProjectImpactsQuery = new SqlReconversionProjectImpactsQuery(db);
    const siteImpactsQuery = new SqlSiteImpactsQuery(db);
    const dateProvider = new RealDateProvider();
    const cityStatsRepository = new SqlCityStatsQuery(db);
    const sqlCarbonStorageQuery = new SqlCarbonStorageQuery(db);
    const getCarbonStorageFromSoilDistribution = new GetCarbonStorageFromSoilDistributionService(
      sqlCarbonStorageQuery,
    );

    const computeImpactsUseCase = new ComputeReconversionProjectImpactsUseCase(
      reconversionProjectImpactsQuery,
      siteImpactsQuery,
      cityStatsRepository,
      getCarbonStorageFromSoilDistribution,
      dateProvider,
    );
    await importAdemeProjects({
      csvFilePath: csvPath,
      createdByUserId: userId,
      addressSearchApi: addressApi,
      sitesRepository,
      reconversionProjectRepository,
      computeImpactsUseCase,
      includeDepartments: includeDepartmentsArg
        ? includeDepartmentsArg.split(",").map((d) => d.trim())
        : undefined,
    });
    // oxlint-disable-next-line no-explicit-any
  } catch (error: any) {
    console.error("Fatal error:", error);
    if (error.errors) {
      console.error(error.errors);
    }
    process.exit(1);
  } finally {
    console.error("Destroying database connection...");
    await db.destroy();
    process.exit(0);
  }
})();
