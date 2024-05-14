import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex("site_expenses").update({ bearer: "operator" }).where("bearer", "tenant");
}

export async function down(knex: Knex): Promise<void> {
  await knex("site_expenses").update({ bearer: "tenant" }).where("bearer", "operator");
}
