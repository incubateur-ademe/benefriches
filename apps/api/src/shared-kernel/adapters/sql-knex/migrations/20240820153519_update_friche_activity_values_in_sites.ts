import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("sites")
    .whereIn("friche_activity", ["HOSPITAL", "ADMINISTRATION"])
    .update({ friche_activity: "PUBLIC_FACILITY" });
}

export async function down(knex: Knex): Promise<void> {
  await knex("sites")
    .where("friche_activity", "PUBLIC_FACILITY")
    .update({ friche_activity: "ADMINISTRATION" });
}
