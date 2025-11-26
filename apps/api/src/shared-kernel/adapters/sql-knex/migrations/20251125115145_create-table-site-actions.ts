import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("site_actions", (table) => {
    table.uuid("id").primary();
    table.uuid("site_id").notNullable().references("id").inTable("sites");
    table.string("action_type").notNullable();
    table.string("status").notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("completed_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("site_actions");
}
