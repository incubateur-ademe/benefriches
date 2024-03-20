import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("users", (table) => {
    table.dropPrimary("users_pkey");
  });
  await knex.schema.renameTable("users", "users_deprecated");
  await knex.schema.createTable("users", function (t) {
    t.uuid("id").primary();
    t.string("email").notNullable();
    t.string("firstname");
    t.string("lastname");
    t.string("structure_type");
    t.string("structure_activity");
    t.string("structure_name");
    t.timestamp("created_at").notNullable();
    t.timestamp("personal_data_storage_consented_at").notNullable();
    t.timestamp("personal_data_analytics_use_consented_at");
    t.timestamp("personal_data_communication_use_consented_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("users");
  await knex.schema.renameTable("users_deprecated", "users");
}
