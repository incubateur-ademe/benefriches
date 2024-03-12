import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import {
  SiteImpactsDataView,
  SiteImpactsRepository,
} from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SoilType } from "src/soils/domain/soils";

export class SqlSiteImpactsRepository implements SiteImpactsRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(siteId: string): Promise<SiteImpactsDataView | undefined> {
    const sqlSite = await this.sqlConnection("sites")
      .select("id", "name", "friche_contaminated_soil_surface_area", "full_time_jobs_involved")
      .where("id", siteId)
      .first();

    if (!sqlSite) return undefined;

    const sqlSoilDistributions = await this.sqlConnection("site_soils_distributions")
      .select("soil_type", "surface_area")
      .where("site_id", siteId);

    return {
      id: sqlSite.id,
      name: sqlSite.name,
      contaminatedSoilSurface: sqlSite.friche_contaminated_soil_surface_area ?? undefined,
      fullTimeJobs: sqlSite.full_time_jobs_involved ?? undefined,
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type as SoilType]: surface_area,
        };
      }, {}),
    };
  }
}
