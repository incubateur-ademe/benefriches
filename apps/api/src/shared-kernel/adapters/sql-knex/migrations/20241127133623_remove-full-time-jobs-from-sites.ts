import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.dropColumn("full_time_jobs_involved");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.decimal("full_time_jobs_involved", 6, 2);
  });
}
