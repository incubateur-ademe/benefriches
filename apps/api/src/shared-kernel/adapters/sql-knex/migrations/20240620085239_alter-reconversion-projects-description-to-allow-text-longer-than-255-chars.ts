import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("reconversion_projects", (table) => {
    table.text("description").alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("reconversion_projects", (table) => {
    table.string("description").alter();
  });
}
