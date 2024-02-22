import { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { SitesRepository } from "src/sites/domain/gateways/SitesRepository";
import { Site } from "src/sites/domain/models/site";
import { SiteViewModel } from "src/sites/domain/usecases/getSiteById.usecase";
import { SoilType } from "src/soils/domain/soils";

declare module "knex/types/tables" {
  interface Tables {
    sites: SqlSite;
    addresses: SqlAddress;
    site_soils_distributions: SqlSoilsDistribution;
    site_expenses: SqlSiteExpense;
    site_incomes: SqlSiteIncome;
  }
}

type SqlSite = {
  id: string;
  name: string;
  created_by: string;
  description: string | null;
  surface_area: number;
  is_friche: boolean;
  full_time_jobs_involved: number | null;
  owner_structure_type: string;
  owner_name: string | null;
  tenant_structure_type: string | null;
  tenant_name: string | null;
  // friche related
  friche_activity: string | null;
  friche_has_contaminated_soils: boolean | null;
  friche_contaminated_soil_surface_area: number | null;
  friche_accidents_minor_injuries: number | null;
  friche_accidents_severe_injuries: number | null;
  friche_accidents_deaths: number | null;
  // dates
  created_at: Date;
};

type SqlAddress = {
  id: string;
  ban_id: string;
  value: string;
  city: string;
  city_code: string;
  post_code: string;
  lat: number;
  long: number;
  street_name: string | null;
  street_number: string | null;
  site_id: string;
};

type SqlSoilsDistribution = {
  id: string;
  soil_type: SoilType;
  surface_area: number;
  site_id: string;
};

type SqlSiteExpense = {
  purpose: string;
  bearer: string;
  purpose_category: string;
  amount: number;
};

type SqlSiteIncome = {
  source: string;
  amount: number;
};

export class SqlSiteRepository implements SitesRepository {
  constructor(private readonly sqlConnection: Knex) {}

  async save(site: Site): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      const [insertedSite] = await trx<SqlSite>("sites").insert(
        {
          id: site.id,
          created_by: site.createdBy,
          name: site.name,
          description: site.description,
          surface_area: site.surfaceArea,
          is_friche: site.isFriche,
          full_time_jobs_involved: site.fullTimeJobsInvolved,
          owner_name: site.owner.name,
          owner_structure_type: site.owner.structureType,
          tenant_name: site.tenant?.name,
          tenant_structure_type: site.tenant?.structureType,
          created_at: site.createdAt,
          ...(site.isFriche
            ? {
                friche_activity: site.fricheActivity,
                friche_accidents_deaths: site.accidentsDeaths,
                friche_accidents_severe_injuries: site.accidentsSevereInjuries,
                friche_accidents_minor_injuries: site.accidentsMinorInjuries,
                friche_contaminated_soil_surface_area: site.contaminatedSoilSurface,
                friche_has_contaminated_soils: site.hasContaminatedSoils,
              }
            : {}),
        },
        "id",
      );

      await trx<SqlAddress>("addresses").insert({
        id: uuid(),
        ban_id: site.address.banId,
        value: site.address.value,
        city: site.address.city,
        city_code: site.address.cityCode,
        post_code: site.address.postCode,
        street_number: site.address.streetNumber,
        street_name: site.address.streetName,
        long: site.address.long,
        lat: site.address.lat,
        site_id: insertedSite.id,
      });

      const soilsDistributionToInsert: SqlSoilsDistribution[] = Object.entries(
        site.soilsDistribution,
      ).map(([soilType, surfaceArea]) => {
        return {
          id: uuid(),
          soil_type: soilType as SoilType,
          surface_area: surfaceArea,
          site_id: insertedSite.id,
        };
      });
      await trx<SqlSoilsDistribution[]>("site_soils_distributions").insert(
        soilsDistributionToInsert,
      );

      if (site.yearlyExpenses.length > 0) {
        const siteExpensesToInsert: SqlSiteExpense[] = site.yearlyExpenses.map((expense) => {
          return {
            id: uuid(),
            site_id: insertedSite.id,
            purpose_category: expense.purposeCategory,
            amount: expense.amount,
            bearer: expense.bearer,
            purpose: expense.purpose,
          };
        });
        await trx<SqlSiteExpense[]>("site_expenses").insert(siteExpensesToInsert);
      }

      if (site.yearlyIncomes.length > 0) {
        const siteIncomesToInsert: SqlSiteIncome[] = site.yearlyIncomes.map((income) => {
          return {
            id: uuid(),
            site_id: insertedSite.id,
            ...income,
          };
        });
        await trx<SqlSiteIncome[]>("site_incomes").insert(siteIncomesToInsert);
      }
    });
  }

  async existsWithId(siteId: string): Promise<boolean> {
    const exists = await this.sqlConnection<SqlSite>("sites")
      .select("id")
      .where({ id: siteId })
      .first();
    return !!exists;
  }

  async getById(siteId: string): Promise<SiteViewModel | undefined> {
    const sqlSite = (await this.sqlConnection("sites")
      .leftJoin("addresses as address", "sites.id", "=", "address.site_id")
      .select(
        "sites.id",
        "sites.name",
        "sites.is_friche",
        "sites.owner_name",
        "sites.owner_structure_type",
        "sites.tenant_name",
        "sites.tenant_structure_type",
        "sites.friche_has_contaminated_soils",
        "sites.friche_contaminated_soil_surface_area",
        "sites.surface_area",
        "address.ban_id as address_ban_id",
        "address.value as address_value",
        "address.city as address_city",
        "address.city_code as address_city_code",
        "address.post_code as address_post_code",
        "address.lat as address_lat",
        "address.long as address_long",
        "address.street_name as address_street_name",
        "address.street_number as address_street_number",
      )
      .where("sites.id", siteId)
      .first()) as
      | undefined
      | {
          id: SqlSite["id"];
          name: SqlSite["name"];
          is_friche: SqlSite["is_friche"];
          surface_area: SqlSite["surface_area"];
          owner_name: SqlSite["owner_name"];
          owner_structure_type: SqlSite["owner_structure_type"];
          tenant_name: SqlSite["tenant_name"];
          tenant_structure_type: SqlSite["tenant_structure_type"];
          friche_has_contaminated_soils: SqlSite["friche_has_contaminated_soils"];
          friche_contaminated_soil_surface_area: SqlSite["friche_contaminated_soil_surface_area"];
          address_ban_id: SqlAddress["ban_id"];
          address_value: SqlAddress["value"];
          address_city: SqlAddress["city"];
          address_city_code: SqlAddress["city_code"];
          address_post_code: SqlAddress["post_code"];
          address_lat: SqlAddress["lat"];
          address_long: SqlAddress["long"];
          address_street_name: SqlAddress["street_name"];
          address_street_number: SqlAddress["street_number"];
        };

    if (!sqlSite) return undefined;

    const sqlSoilDistributions = await this.sqlConnection("site_soils_distributions")
      .select("soil_type", "surface_area")
      .where("site_id", siteId);

    return {
      id: sqlSite.id,
      name: sqlSite.name,
      isFriche: sqlSite.is_friche,
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
        banId: sqlSite.address_ban_id,
        value: sqlSite.address_value,
        city: sqlSite.address_city,
        cityCode: sqlSite.address_city_code,
        postCode: sqlSite.address_post_code,
        lat: sqlSite.address_lat,
        long: sqlSite.address_long,
        streetName: sqlSite.address_street_name ?? undefined,
        streetNumber: sqlSite.address_street_number ?? undefined,
      },
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type as SoilType]: surface_area,
        };
      }, {}),
    };
  }
}
