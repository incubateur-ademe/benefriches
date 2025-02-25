import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("sites")
    .whereIn("friche_activity", ["PUBLIC_FACILITY", "BUSINESS", "HOUSING"])
    .update({ friche_activity: "BUILDING" });
}

export async function down(knex: Knex): Promise<void> {
  await knex("sites").where("friche_activity", "BUILDING").update({ friche_activity: "HOUSING" });
}
