import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.string("agricultural_operation_activity");
    table.string("natural_area_type");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.dropColumn("agricultural_operation_activity");
    table.dropColumn("natural_area_type");
  });
}
