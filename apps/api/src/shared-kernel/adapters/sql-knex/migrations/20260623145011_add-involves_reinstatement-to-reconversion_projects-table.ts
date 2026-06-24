import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.boolean("involves_reinstatement").notNullable().defaultTo(true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.dropColumn("involves_reinstatement");
  });
}
