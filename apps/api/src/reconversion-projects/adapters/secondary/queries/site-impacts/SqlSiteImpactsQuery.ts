import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { SiteYearlyExpense } from "shared";

import {
  SiteImpactsDataView,
  SiteImpactsQuery,
} from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

export class SqlSiteImpactsQuery implements SiteImpactsQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(siteId: string): Promise<SiteImpactsDataView | undefined> {
    const sqlSite = await this.sqlConnection("sites")
      .select(
        "id",
        "name",
        "is_friche",
        "friche_activity",
        "surface_area",
        "friche_contaminated_soil_surface_area",
        "friche_accidents_minor_injuries",
        "friche_accidents_severe_injuries",
        "friche_accidents_deaths",
        "owner_name",
        "owner_structure_type",
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
      isFriche: sqlSite.is_friche,
      fricheActivity: sqlSite.friche_activity ?? undefined,
      addressCityCode: sqlAddress?.city_code ?? "",
      addressLabel: sqlAddress?.value ?? "",
      surfaceArea: sqlSite.surface_area,
      contaminatedSoilSurface: sqlSite.friche_contaminated_soil_surface_area ?? undefined,
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type]: surface_area,
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
      ownerStructureType: sqlSite.owner_structure_type,
      tenantName: sqlSite.tenant_name ?? undefined,
      yearlyExpenses: sqlYearlyExpenses as SiteYearlyExpense[],
    };
  }
}
