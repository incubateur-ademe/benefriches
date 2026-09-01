import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("token_authentication_attempts", (table) => {
    table.timestamp("revoked_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("token_authentication_attempts", (table) => {
    table.dropColumn("revoked_at");
  });
}
