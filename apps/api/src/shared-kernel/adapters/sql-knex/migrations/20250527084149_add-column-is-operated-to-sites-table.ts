import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.boolean("is_operated");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.dropColumn("is_operated");
  });
}
