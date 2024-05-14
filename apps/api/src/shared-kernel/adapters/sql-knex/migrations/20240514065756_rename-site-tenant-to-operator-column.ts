import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.renameColumn("tenant_structure_type", "operator_structure_type");
    table.renameColumn("tenant_name", "operator_name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("sites", function (table) {
    table.renameColumn("operator_structure_type", "tenant_structure_type");
    table.renameColumn("operator_name", "tenant_name");
  });
}
