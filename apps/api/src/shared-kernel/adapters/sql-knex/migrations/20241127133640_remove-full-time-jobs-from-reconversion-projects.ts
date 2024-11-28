import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.dropColumns(
      "future_operations_full_time_jobs",
      "conversion_full_time_jobs_involved",
      "reinstatement_full_time_jobs_involved",
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.decimal("future_operations_full_time_jobs", 6, 2);
    table.decimal("conversion_full_time_jobs_involved", 6, 2);
    table.decimal("reinstatement_full_time_jobs_involved", 6, 2);
  });
}
