import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("site_expenses", function (table) {
    table.renameColumn("category", "purpose_category");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("site_expenses", function (table) {
    table.renameColumn("purpose_category", "category");
  });
}
