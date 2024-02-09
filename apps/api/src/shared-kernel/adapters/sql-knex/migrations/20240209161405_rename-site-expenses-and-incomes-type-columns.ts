import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("site_expenses", function (table) {
    table.renameColumn("type", "purpose");
  });

  await knex.schema.table("site_incomes", function (table) {
    table.renameColumn("type", "source");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("site_expenses", function (table) {
    table.renameColumn("purpose", "type");
  });

  await knex.schema.table("site_incomes", function (table) {
    table.renameColumn("source", "type");
  });
}
