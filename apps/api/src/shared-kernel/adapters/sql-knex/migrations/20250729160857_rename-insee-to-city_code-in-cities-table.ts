import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("cities", function (table) {
    table.renameColumn("insee", "city_code");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("cities", function (table) {
    table.renameColumn("city_code", "insee");
  });
}
