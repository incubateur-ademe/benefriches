import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sites", (table) => {
    table.text("description").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("sites", (table) => {
    table.string("description").alter();
  });
}
