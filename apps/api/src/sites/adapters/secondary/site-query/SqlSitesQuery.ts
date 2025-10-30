import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { SiteNature } from "shared";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  SqlAddress,
  SqlSite,
  SqlSiteExpense,
  SqlSiteIncome,
  SqlSiteSoilsDistribution,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { SitesQuery, SiteViewModel } from "src/sites/core/gateways/SitesQuery";

export class SqlSitesQuery implements SitesQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(siteId: string): Promise<SiteViewModel | undefined> {
    const sqlResult = (await this.sqlConnection("sites")
      .where("sites.id", siteId)
      .leftJoin("addresses as address", "sites.id", "address.site_id")
      .leftJoin("site_expenses as expenses", "sites.id", "expenses.site_id")
      .leftJoin("site_incomes as incomes", "sites.id", "incomes.site_id")
      .leftJoin(
        "site_soils_distributions as soils_distribution",
        "sites.id",
        "soils_distribution.site_id",
      )
      .select(
        "sites.id",
        "sites.name",
        "sites.nature",
        "sites.creation_mode",
        "sites.friche_activity",
        "sites.agricultural_operation_activity",
        "sites.natural_area_type",
        "sites.description",
        "sites.owner_name",
        "sites.owner_structure_type",
        "sites.tenant_name",
        "sites.tenant_structure_type",
        "sites.surface_area",
        "sites.friche_has_contaminated_soils",
        "sites.friche_contaminated_soil_surface_area",
        "sites.friche_accidents_minor_injuries",
        "sites.friche_accidents_severe_injuries",
        "sites.friche_accidents_deaths",
        "address.ban_id as address_ban_id",
        "address.value as address_value",
        "address.city as address_city",
        "address.city_code as address_city_code",
        "address.post_code as address_post_code",
        "address.lat as address_lat",
        "address.long as address_long",
        "address.street_name as address_street_name",
        "address.street_number as address_street_number",
        this.sqlConnection.raw(`
          jsonb_agg(
            distinct jsonb_build_object(
              'amount', expenses.amount,
              'purpose', expenses.purpose
            ) 
          ) FILTER (WHERE expenses.id IS NOT NULL) AS "yearly_expenses"
        `),
        this.sqlConnection.raw(`
          jsonb_agg(
            distinct jsonb_build_object(
              'amount', incomes.amount,
              'source', incomes.source
            ) 
          ) FILTER (WHERE incomes.id IS NOT NULL) AS "yearly_incomes"
        `),
        this.sqlConnection.raw(`
          jsonb_agg(
            distinct jsonb_build_object(
              'soil_type', soils_distribution.soil_type,
              'surface_area', soils_distribution.surface_area
            )
          ) FILTER (WHERE soils_distribution.id IS NOT NULL) AS "soils_distribution"
    `),
      )
      .groupBy("sites.id", "address.id")) as
      | undefined
      | {
          id: SqlSite["id"];
          name: SqlSite["name"];
          nature: SqlSite["nature"];
          creation_mode: SqlSite["creation_mode"];
          description: SqlSite["description"];
          friche_activity: SqlSite["friche_activity"];
          agricultural_operation_activity: SqlSite["agricultural_operation_activity"];
          natural_area_type: SqlSite["natural_area_type"];
          surface_area: SqlSite["surface_area"];
          owner_name: SqlSite["owner_name"];
          owner_structure_type: SqlSite["owner_structure_type"];
          tenant_name: SqlSite["tenant_name"];
          tenant_structure_type: SqlSite["tenant_structure_type"];
          friche_has_contaminated_soils: SqlSite["friche_has_contaminated_soils"];
          friche_contaminated_soil_surface_area: SqlSite["friche_contaminated_soil_surface_area"];
          friche_accidents_minor_injuries: SqlSite["friche_accidents_minor_injuries"];
          friche_accidents_severe_injuries: SqlSite["friche_accidents_severe_injuries"];
          friche_accidents_deaths: SqlSite["friche_accidents_deaths"];
          address_ban_id: SqlAddress["ban_id"];
          address_value: SqlAddress["value"];
          address_city: SqlAddress["city"];
          address_city_code: SqlAddress["city_code"];
          address_post_code: SqlAddress["post_code"];
          address_lat: SqlAddress["lat"];
          address_long: SqlAddress["long"];
          address_street_name: SqlAddress["street_name"];
          address_street_number: SqlAddress["street_number"];
          soils_distribution: Pick<SqlSiteSoilsDistribution, "soil_type" | "surface_area">[] | null;
          yearly_expenses: Pick<SqlSiteExpense, "amount" | "purpose">[] | null;
          yearly_incomes: Pick<SqlSiteIncome, "amount" | "source">[] | null;
        }[];

    const sqlSite = sqlResult?.[0];
    if (!sqlSite) return undefined;

    return {
      id: sqlSite.id,
      name: sqlSite.name,
      nature: sqlSite.nature as SiteNature,
      isExpressSite: sqlSite.creation_mode === "express",
      description: sqlSite.description ?? undefined,
      fricheActivity: sqlSite.friche_activity ?? undefined,
      agriculturalOperationActivity: sqlSite.agricultural_operation_activity ?? undefined,
      naturalAreaType: sqlSite.natural_area_type ?? undefined,
      owner: {
        name: sqlSite.owner_name ?? undefined,
        structureType: sqlSite.owner_structure_type,
      },
      tenant: sqlSite.tenant_structure_type
        ? { name: sqlSite.tenant_name ?? undefined, structureType: sqlSite.tenant_structure_type }
        : undefined,
      hasContaminatedSoils: sqlSite.friche_has_contaminated_soils ?? undefined,
      contaminatedSoilSurface: sqlSite.friche_contaminated_soil_surface_area ?? undefined,
      surfaceArea: sqlSite.surface_area,
      address: {
        banId: sqlSite.address_ban_id ?? undefined,
        value: sqlSite.address_value,
        city: sqlSite.address_city,
        cityCode: sqlSite.address_city_code,
        postCode: sqlSite.address_post_code,
        lat: sqlSite.address_lat,
        long: sqlSite.address_long,
        streetName: sqlSite.address_street_name ?? undefined,
        streetNumber: sqlSite.address_street_number ?? undefined,
      },
      soilsDistribution: (sqlSite.soils_distribution ?? []).reduce(
        (acc, { soil_type, surface_area }) => {
          return {
            ...acc,
            [soil_type]: surface_area,
          };
        },
        {},
      ),
      accidentsMinorInjuries: sqlSite.friche_accidents_minor_injuries ?? undefined,
      accidentsSevereInjuries: sqlSite.friche_accidents_severe_injuries ?? undefined,
      accidentsDeaths: sqlSite.friche_accidents_deaths ?? undefined,
      yearlyExpenses: sqlSite.yearly_expenses ?? [],
      yearlyIncomes: sqlSite.yearly_incomes ?? [],
    };
  }
}
