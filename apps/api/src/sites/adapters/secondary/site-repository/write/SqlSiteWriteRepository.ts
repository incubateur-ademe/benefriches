import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SitesWriteRepository } from "src/sites/core/gateways/SitesWriteRepository";
import { Site } from "src/sites/core/models/site";
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
  id: string;
  site_id: string;
  purpose: string;
  bearer: string;
  purpose_category: string;
  amount: number;
};

type SqlSiteIncome = {
  id: string;
  site_id: string;
  source: string;
  amount: number;
};

export class SqlSiteWriteRepository implements SitesWriteRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

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

      if (!insertedSite) throw new Error("Failed to insert site");

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
}
