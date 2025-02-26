import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { SoilType } from "shared";
import { v4 as uuid } from "uuid";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  SqlAddress,
  SqlSite,
  SqlSiteExpense,
  SqlSiteIncome,
  SqlSiteSoilsDistribution,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { SiteEntity } from "src/sites/core/models/site";

export class SqlSiteRepository implements SitesRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(site: SiteEntity): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      const [insertedSite] = await trx<SqlSite>("sites").insert(
        {
          id: site.id,
          created_by: site.createdBy,
          creation_mode: site.creationMode,
          name: site.name,
          description: site.description,
          surface_area: site.surfaceArea,
          is_friche: site.isFriche,
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

      const soilsDistributionToInsert: SqlSiteSoilsDistribution[] = Object.entries(
        site.soilsDistribution.toJSON(),
      ).map(([soilType, surfaceArea]) => {
        return {
          id: uuid(),
          soil_type: soilType as SoilType,
          surface_area: surfaceArea,
          site_id: insertedSite.id,
        };
      });
      await trx<SqlSiteSoilsDistribution[]>("site_soils_distributions").insert(
        soilsDistributionToInsert,
      );

      if (site.yearlyExpenses.length > 0) {
        const siteExpensesToInsert: SqlSiteExpense[] = site.yearlyExpenses.map((expense) => {
          return {
            id: uuid(),
            site_id: insertedSite.id,
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
