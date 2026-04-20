// oxlint-disable no-console
import { configDotenv } from "dotenv";
import knex from "knex";
import fs from "node:fs";
import path from "node:path";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlSiteRepository } from "src/sites/adapters/secondary/site-repository/SqlSiteRepository";

import { SqlReconversionProjectRepository } from "../repositories/reconversion-project/SqlReconversionProjectRepository";
import { BanAddressSearchGateway } from "./BaseAdresseNationaleClient";
import { CachedAddressSearchGateway } from "./CachedAddressSearchGateway";
import { buildAdemeScriptComputeImpactsUseCase } from "./ademeScriptDeps";
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
    "Usage: pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/import-ademe-csv.ts <csv-path> <user-id>",
  );
  console.error("\nExample:");
  console.error(
    '  pnpm exec tsx src/reconversion-projects/adapters/secondary/ademe-csv-import/import-ademe-csv.ts ./ademe-projects.csv "user-123"',
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
    const cacheFilePath = path.resolve(__dirname, "address-cache.json");
    const addressApi = new CachedAddressSearchGateway(new BanAddressSearchGateway(), cacheFilePath);

    const computeImpactsUseCase = buildAdemeScriptComputeImpactsUseCase(db);
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
    process.exitCode = 1;
    console.error("Fatal error:", error);
    if (error.errors) {
      console.error(error.errors);
    }
  } finally {
    console.error("Destroying database connection...");
    await db.destroy();
  }
})();
