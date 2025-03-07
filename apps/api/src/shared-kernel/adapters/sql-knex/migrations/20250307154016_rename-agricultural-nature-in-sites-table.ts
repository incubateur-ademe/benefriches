import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("sites").where("nature", "AGRICULTURAL").update({ nature: "AGRICULTURAL_OPERATION" });
}

export async function down(knex: Knex): Promise<void> {
  await knex("sites").where("nature", "AGRICULTURAL_OPERATION").update({ nature: "AGRICULTURAL" });
}
