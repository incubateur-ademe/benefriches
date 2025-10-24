import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("addresses", (table) => {
    table.string("ban_id").nullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("addresses", (table) => {
    table.string("ban_id").notNullable().alter();
  });
}
