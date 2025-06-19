import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import {
  AgriculturalOperationActivity,
  FricheActivity,
  SiteImpactsDataView,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
} from "shared";

import { SiteImpactsQuery } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

export class SqlSiteImpactsQuery implements SiteImpactsQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(siteId: string): Promise<SiteImpactsDataView | undefined> {
    const sqlSite = await this.sqlConnection("sites")
      .select(
        "id",
        "description",
        "name",
        "nature",
        "creation_mode",
        "friche_activity",
        "agricultural_operation_activity",
        "is_operated",
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

    const sqlYearlyIncomes = await this.sqlConnection("site_incomes")
      .select("amount", "source")
      .where("site_id", siteId);

    const sqlAddress = await this.sqlConnection("addresses")
      .select("city_code", "value", "city", "ban_id", "post_code", "lat", "long")
      .where("site_id", siteId)
      .first();

    return {
      id: sqlSite.id,
      name: sqlSite.name,
      description: sqlSite.description ?? undefined,
      nature: sqlSite.nature as SiteNature,
      fricheActivity: (sqlSite.friche_activity ?? undefined) as FricheActivity,
      agriculturalOperationActivity: (sqlSite.agricultural_operation_activity ??
        undefined) as AgriculturalOperationActivity,
      isSiteOperated: sqlSite.is_operated ?? undefined,
      address: {
        value: sqlAddress?.value ?? "",
        cityCode: sqlAddress?.city_code ?? "",
        city: sqlAddress?.city ?? "",
        banId: sqlAddress?.ban_id ?? "",
        postCode: sqlAddress?.post_code ?? "",
        lat: sqlAddress?.lat ?? 0,
        long: sqlAddress?.long ?? 0,
      },
      surfaceArea: sqlSite.surface_area,
      contaminatedSoilSurface: sqlSite.friche_contaminated_soil_surface_area ?? undefined,
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type]: surface_area,
        };
      }, {}),
      accidentsDeaths: sqlSite.friche_accidents_deaths ?? undefined,
      accidentsSevereInjuries: sqlSite.friche_accidents_severe_injuries ?? undefined,
      accidentsMinorInjuries: sqlSite.friche_accidents_minor_injuries ?? undefined,
      ownerName: sqlSite.owner_name ?? "",
      ownerStructureType: sqlSite.owner_structure_type,
      tenantName: sqlSite.tenant_name ?? undefined,
      yearlyExpenses: sqlYearlyExpenses as SiteYearlyExpense[],
      yearlyIncomes: sqlYearlyIncomes as SiteYearlyIncome[],
      isExpressSite: sqlSite.creation_mode === "express",
    };
  }
}
