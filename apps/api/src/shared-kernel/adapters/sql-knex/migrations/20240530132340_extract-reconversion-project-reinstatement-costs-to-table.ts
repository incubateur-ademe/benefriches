import type { Knex } from "knex";
import { v4 as uuid } from "uuid";

export async function up(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    // create reconversion_project_reinstatement_costs table
    await trx.schema.createTable("reconversion_project_reinstatement_costs", function (table) {
      table.uuid("id").unique().primary().notNullable();
      table.string("purpose").notNullable();
      table.decimal("amount", 15, 2);
      table
        .uuid("reconversion_project_id")
        .references("id")
        .inTable("reconversion_projects")
        .notNullable();
    });

    // retrieve all non-null, non-zero reinstatement costs in reconversion_projects
    const result = (await trx("reconversion_projects")
      .select("id", "reinstatement_cost")
      .whereNotNull("reinstatement_cost")
      .where("reinstatement_cost", ">", 0)) as { id: string; reinstatement_cost: number }[];

    // insert in created reconversion_project_reinstatement_costs table
    const reinstatementCostsToInsert = result.map(({ id, reinstatement_cost }) => {
      return {
        id: uuid(),
        purpose: "other_reinstatement_costs",
        amount: reinstatement_cost,
        reconversion_project_id: id,
      };
    });
    if (reinstatementCostsToInsert.length > 0)
      await trx("reconversion_project_reinstatement_costs").insert(reinstatementCostsToInsert);

    // delete reinstatement_cost column from reconversion_projects table
    await trx.schema.table("reconversion_projects", function (table) {
      table.dropColumn("reinstatement_cost");
    });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.transaction(async (trx) => {
    await trx.schema.table("reconversion_projects", function (table) {
      table.decimal("reinstatement_cost", 15, 2);
    });

    // delete reconversion_project_reinstatement_costs table
    await trx.schema.dropTableIfExists("reconversion_project_reinstatement_costs");
  });
}
