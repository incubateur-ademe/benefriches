import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("france_ruralites", function (t) {
    // INSEE code of a commune classified as rural in the official
    // "France Ruralités Revitalisation" list. Presence in this table means rural.
    t.string("city_code").primary().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("france_ruralites");
}
