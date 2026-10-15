import type { Knex } from "knex";

import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { GetProjectImpactAnalysisUseCase } from "src/reconversion-projects/core/usecases/getProjectImpactsAnalysisUseCase.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SilentLogger } from "src/shared-kernel/adapters/logger/SilentLogger";
import { SqlSiteImpactsQuery } from "src/sites/adapters/secondary/site-impacts/SqlSiteImpactsQuery";
import { SqlSitesQuery } from "src/sites/adapters/secondary/site-query/SqlSitesQuery";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { SqlCityImpactsQuery } from "src/territory/adapters/secondary/city-impacts-query/SqlCityImpactsQuery";
import {
  CapitalExpendituresResult,
  MunicipalityCapitalExpendituresProvider,
} from "src/territory/core/gateways/MunicipalityCapitalExpendituresProvider";

import { SqlReconversionProjectQuery } from "../queries/reconversion-project-features/SqlReconversionProjectQuery";
import { SqlReconversionProjectImpactsQuery } from "../queries/reconversion-project-impacts/SqlReconversionProjectImpactsQuery";

export function buildAdemeScriptComputeImpactsUseCase(
  db: Knex,
): ComputeReconversionProjectImpactsUseCase {
  const reconversionProjectImpactsQuery = new SqlReconversionProjectImpactsQuery(db);
  const siteImpactsQuery = new SqlSiteImpactsQuery(db);
  const dateProvider = new RealDateProvider();
  const cityDataRepository = new SqlCityImpactsQuery(db);
  const sqlCarbonStorageQuery = new SqlCarbonStorageQuery(db);
  const getCarbonStorageFromSoilDistribution = new GetCarbonStorageFromSoilDistributionService(
    sqlCarbonStorageQuery,
    new SilentLogger(),
  );

  return new ComputeReconversionProjectImpactsUseCase(
    reconversionProjectImpactsQuery,
    siteImpactsQuery,
    cityDataRepository,
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

class MunicipalityCapitalExpendituresData implements MunicipalityCapitalExpendituresProvider {
  data: Map<string, CapitalExpendituresResult>;
  constructor(data: Map<string, CapitalExpendituresResult>) {
    this.data = data;
  }

  getLastReferenceYear(cityCode: string) {
    const value = this.data.get(cityCode);
    if (!value) {
      const err = new Error(
        `Error response from MunicipalityCapitalExpendituresData service: not found for cityCode ${cityCode}`,
      );

      throw err;
    }
    return Promise.resolve(value);
  }
}

export function buildScriptComputeDevelopmentScoreUseCase(
  db: Knex,
  municipalityCapitalExpendituresData: Map<string, CapitalExpendituresResult>,
): GetProjectImpactAnalysisUseCase {
  const reconversionProjectImpactsQuery = new SqlReconversionProjectImpactsQuery(db);
  const siteImpactsQuery = new SqlSiteImpactsQuery(db);
  const dateProvider = new RealDateProvider();
  const cityDataRepository = new SqlCityImpactsQuery(db);
  const sqlCarbonStorageQuery = new SqlCarbonStorageQuery(db);
  const municipalityCapitalExpendituresQuery = new MunicipalityCapitalExpendituresData(
    municipalityCapitalExpendituresData,
  );
  const getCarbonStorageFromSoilDistribution = new GetCarbonStorageFromSoilDistributionService(
    sqlCarbonStorageQuery,
    new SilentLogger(),
  );

  return new GetProjectImpactAnalysisUseCase(
    reconversionProjectImpactsQuery,
    siteImpactsQuery,
    getCarbonStorageFromSoilDistribution,
    cityDataRepository,
    municipalityCapitalExpendituresQuery,
    dateProvider,
  );
}
