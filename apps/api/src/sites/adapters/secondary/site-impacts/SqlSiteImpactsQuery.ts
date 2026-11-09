import { Inject } from "@nestjs/common";
import type { Knex } from "knex";
import {
  AgriculturalOperationActivity,
  FricheActivity,
  NaturalAreaType,
  SiteImpactsDataView,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
  SoilsDistribution,
} from "shared";

import { SiteImpactsQuery } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { aggregateSoilsFromParcels } from "src/sites/core/models/site";

import { parseUrbanZoneLandParcels } from "../parseUrbanZoneLandParcels";

export class SqlSiteImpactsQuery implements SiteImpactsQuery {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  // Urban zone soils are stored per land parcel in site_urban_zone_features, not in
  // site_soils_distributions: the site's soils are the sum of its parcels' soils.
  private async getUrbanZoneSoilsDistribution(siteId: string): Promise<SoilsDistribution> {
    const urbanZoneFeatures = await this.sqlConnection("site_urban_zone_features")
      .select("land_parcels")
      .where("site_id", siteId)
      .first();

    return aggregateSoilsFromParcels(
      parseUrbanZoneLandParcels(urbanZoneFeatures?.land_parcels),
    ).toJSON();
  }

  private async getSiteSoilsDistribution(siteId: string): Promise<SoilsDistribution> {
    const sqlSoilDistributions = await this.sqlConnection("site_soils_distributions")
      .select("soil_type", "surface_area")
      .where("site_id", siteId);

    return sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
      return {
        ...acc,
        [soil_type]: surface_area,
      };
    }, {});
  }

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
        "natural_area_type",
        "is_operated",
        "surface_area",
        "friche_contaminated_soil_surface_area",
        "friche_accidents_minor_injuries",
        "friche_accidents_severe_injuries",
        "friche_accidents_deaths",
        "owner_name",
        "owner_structure_type",
        "tenant_structure_type",
        "tenant_name",
      )
      .where("id", siteId)
      .first();

    if (!sqlSite) return undefined;

    const soilsDistribution =
      sqlSite.nature === "URBAN_ZONE"
        ? await this.getUrbanZoneSoilsDistribution(siteId)
        : await this.getSiteSoilsDistribution(siteId);

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
      naturalAreaType: (sqlSite.natural_area_type ?? undefined) as NaturalAreaType,
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
      soilsDistribution,
      accidentsDeaths: sqlSite.friche_accidents_deaths ?? undefined,
      accidentsSevereInjuries: sqlSite.friche_accidents_severe_injuries ?? undefined,
      accidentsMinorInjuries: sqlSite.friche_accidents_minor_injuries ?? undefined,
      ownerName: sqlSite.owner_name ?? "",
      ownerStructureType: sqlSite.owner_structure_type,
      tenantStructureType: sqlSite.tenant_structure_type ?? undefined,
      tenantName: sqlSite.tenant_name ?? undefined,
      yearlyExpenses: sqlYearlyExpenses as SiteYearlyExpense[],
      yearlyIncomes: sqlYearlyIncomes as SiteYearlyIncome[],
      isExpressSite: sqlSite.creation_mode === "express",
    };
  }
}
