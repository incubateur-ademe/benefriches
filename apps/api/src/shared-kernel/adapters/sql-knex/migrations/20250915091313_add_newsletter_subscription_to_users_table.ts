import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", function (table) {
    table.boolean("subscribed_to_newsletter").defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("users", function (table) {
    table.dropColumn("subscribed_to_newsletter");
  });
}
