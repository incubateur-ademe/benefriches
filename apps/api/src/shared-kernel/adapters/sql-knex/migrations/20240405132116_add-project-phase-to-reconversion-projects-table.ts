import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.string("project_phase").defaultTo("unknown");
    table.string("project_phase_details");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.dropColumn("project_phase");
    table.dropColumn("project_phase_details");
  });
}
