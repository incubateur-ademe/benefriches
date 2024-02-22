import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.timestamp("reinstatement_schedule_start_date").nullable();
    table.timestamp("reinstatement_schedule_end_date").nullable();
    table.integer("operations_first_year").nullable();
  });

  await knex.schema.table("reconversion_project_development_plans", (table) => {
    table.timestamp("schedule_start_date").nullable();
    table.timestamp("schedule_end_date").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.dropColumn("reinstatement_schedule_start_date");
    table.dropColumn("reinstatement_schedule_end_date");
    table.dropColumn("operations_first_year");
  });

  await knex.schema.table("reconversion_project_development_plans", (table) => {
    table.dropColumn("schedule_start_date");
    table.dropColumn("schedule_end_date");
  });
}
