import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_development_plans", function (table) {
    table.string("developer_name");
    table.string("developer_structure_type");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_development_plans", function (table) {
    table.dropColumn("developer_name");
    table.dropColumn("developer_structure_type");
  });
}
