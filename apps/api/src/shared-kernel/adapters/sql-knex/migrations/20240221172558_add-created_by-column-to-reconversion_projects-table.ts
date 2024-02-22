import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.uuid("created_by");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.dropColumn("created_by");
  });
}
