import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("token_authentication_attempts", function (table) {
    table.string("token").unique().primary();
    table.uuid("user_id").notNullable();
    table.string("email").notNullable();
    table.timestamp("created_at").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("used_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("token_authentication_attempts");
}
