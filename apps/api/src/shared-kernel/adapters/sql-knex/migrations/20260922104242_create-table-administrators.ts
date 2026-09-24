import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("administrators", (table) => {
    table.uuid("user_id").primary().references("id").inTable("users").onDelete("CASCADE");
    table.timestamp("created_at").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("administrators");
}
