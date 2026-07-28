import type { Knex } from "knex";

import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SilentLogger } from "src/shared-kernel/adapters/logger/SilentLogger";
import { SqlSiteImpactsQuery } from "src/sites/adapters/secondary/site-impacts/SqlSiteImpactsQuery";
import { SqlSitesQuery } from "src/sites/adapters/secondary/site-query/SqlSitesQuery";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { SqlCityStatsQuery } from "src/territory/adapters/secondary/city-stats-query/SqlCityStatsQuery";

import { SqlReconversionProjectQuery } from "../queries/reconversion-project-features/SqlReconversionProjectQuery";
import { SqlReconversionProjectImpactsQuery } from "../queries/reconversion-project-impacts/SqlReconversionProjectImpactsQuery";

export function buildAdemeScriptComputeImpactsUseCase(
  db: Knex,
): ComputeReconversionProjectImpactsUseCase {
  const reconversionProjectImpactsQuery = new SqlReconversionProjectImpactsQuery(db);
  const siteImpactsQuery = new SqlSiteImpactsQuery(db);
  const dateProvider = new RealDateProvider();
  const cityStatsRepository = new SqlCityStatsQuery(db);
  const sqlCarbonStorageQuery = new SqlCarbonStorageQuery(db);
  const getCarbonStorageFromSoilDistribution = new GetCarbonStorageFromSoilDistributionService(
    sqlCarbonStorageQuery,
    new SilentLogger(),
  );

  return new ComputeReconversionProjectImpactsUseCase(
    reconversionProjectImpactsQuery,
    siteImpactsQuery,
    cityStatsRepository,
    getCarbonStorageFromSoilDistribution,
    dateProvider,
  );
}

export function buildAdemeScriptGetSiteByIdUseCase(db: Knex): GetSiteByIdUseCase {
  const sitesQuery = new SqlSitesQuery(db);
  return new GetSiteByIdUseCase(sitesQuery);
}

export function buildAdemeScriptGetReconversionProjectFeaturesUseCase(
  db: Knex,
): GetReconversionProjectFeaturesUseCase {
  const reconversionProjectQuery = new SqlReconversionProjectQuery(db);
  return new GetReconversionProjectFeaturesUseCase(reconversionProjectQuery);
}
