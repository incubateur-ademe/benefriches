import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_soils_distributions", function (table) {
    table.string("space_category");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_soils_distributions", function (table) {
    table.string("space_category");
  });
}
