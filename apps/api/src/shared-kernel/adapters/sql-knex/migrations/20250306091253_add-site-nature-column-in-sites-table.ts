import type { Knex } from "knex";

export async function up(knex: Knex) {
  await knex.schema.table("sites", function (table) {
    table.string("nature");
  });

  // set nature based on "is_friche"
  await knex("sites").update({
    nature: knex.raw("CASE WHEN is_friche = true THEN 'FRICHE' ELSE 'AGRICULTURAL' END"),
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.dropColumn("nature");
  });
}
