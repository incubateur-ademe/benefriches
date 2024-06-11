import type { Knex } from "knex";
import { v4 as uuid } from "uuid";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // create reconversion_project_reinstatement_costs table
    await trx.schema.createTable("reconversion_project_development_plan_costs", function (table) {
      table.uuid("id").unique().primary().notNullable();
      table.string("purpose").notNullable();
      table.decimal("amount", 15, 2);
      table
        .uuid("development_plan_id")
        .references("id")
        .inTable("reconversion_project_development_plans")
        .notNullable();
    });

    // non-zero development plan costs
    const developmentPlansWithCostInDb = (await trx("reconversion_project_development_plans")
      .select("id", "cost")
      .where("cost", ">", 0)) as { id: string; cost: number }[];
    const developmentPlanCostsToInsert = developmentPlansWithCostInDb.map(({ id, cost }) => {
      return {
        id: uuid(),
        purpose: "other",
        amount: cost,
        development_plan_id: id,
      };
    });
    if (developmentPlanCostsToInsert.length > 0)
      await trx("reconversion_project_development_plan_costs").insert(developmentPlanCostsToInsert);

    // drop cost column in development plans table
    await trx.schema.table("reconversion_project_development_plans", function (table) {
      table.dropColumn("cost");
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("reconversion_project_development_plans", function (table) {
      table.decimal("cost", 15, 2);
    });

    // delete reconversion_project_reinstatement_costs table
    await trx.schema.dropTableIfExists("reconversion_project_development_plan_costs");
  });
}
