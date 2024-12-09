import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("site_expenses", function (table) {
    table.dropColumn("purpose_category");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("site_expenses", (table) => {
    table.string("purpose_category").notNullable().defaultTo("other");
  });
}
