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
      .select(
        "id",
        "name",
        "surface_area",
        "friche_contaminated_soil_surface_area",
        "full_time_jobs_involved",
        "friche_accidents_minor_injuries",
        "friche_accidents_severe_injuries",
        "friche_accidents_deaths",
        "owner_name",
        "tenant_name",
      )
      .where("id", siteId)
      .first();

    if (!sqlSite) return undefined;

    const sqlSoilDistributions = await this.sqlConnection("site_soils_distributions")
      .select("soil_type", "surface_area")
      .where("site_id", siteId);

    const sqlYearlyExpenses = await this.sqlConnection("site_expenses")
      .select("amount", "purpose", "bearer")
      .where("site_id", siteId);

    const sqlAddress = await this.sqlConnection("addresses")
      .select("city_code", "value")
      .where("site_id", siteId)
      .first();

    return {
      id: sqlSite.id,
      name: sqlSite.name,
      addressCityCode: sqlAddress?.city_code ?? "",
      addressLabel: sqlAddress?.value ?? "",
      surfaceArea: sqlSite.surface_area,
      contaminatedSoilSurface: sqlSite.friche_contaminated_soil_surface_area ?? undefined,
      fullTimeJobs: sqlSite.full_time_jobs_involved ?? undefined,
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type as SoilType]: surface_area,
        };
      }, {}),
      hasAccidents:
        Boolean(sqlSite.friche_accidents_deaths) ||
        Boolean(sqlSite.friche_accidents_minor_injuries) ||
        Boolean(sqlSite.friche_accidents_severe_injuries),
      accidentsDeaths: sqlSite.friche_accidents_deaths ?? undefined,
      accidentsSevereInjuries: sqlSite.friche_accidents_severe_injuries ?? undefined,
      accidentsMinorInjuries: sqlSite.friche_accidents_minor_injuries ?? undefined,
      ownerName: sqlSite.owner_name ?? "",
      tenantName: sqlSite.tenant_name ?? undefined,
      yearlyCosts: sqlYearlyExpenses,
    };
  }
}
