import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("reconversion_project_development_plans")
    .where("type", "MIXED_USE_NEIGHBOURHOOD")
    .update({ type: "URBAN_PROJECT" });
}

export async function down(knex: Knex): Promise<void> {
  await knex("reconversion_project_development_plans")
    .where("type", "URBAN_PROJECT")
    .update({ type: "MIXED_USE_NEIGHBOURHOOD" });
}
