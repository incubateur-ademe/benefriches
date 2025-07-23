import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("auth_external_user_identities", function (table) {
    table.uuid("id").unique().primary();
    table.uuid("user_id").notNullable();
    table.string("provider").notNullable();
    table.string("provider_user_id").notNullable();
    table.timestamp("created_at").notNullable();
    table.jsonb("provider_info");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("auth_external_user_identities");
}
