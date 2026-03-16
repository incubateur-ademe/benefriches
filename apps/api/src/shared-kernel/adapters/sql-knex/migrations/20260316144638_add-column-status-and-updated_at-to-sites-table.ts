import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.string("status").defaultTo("active");
    table.timestamp("updated_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.dropColumn("status");
    table.dropColumn("updated_at");
  });
}
