import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users_feature_alerts", function (table) {
    table.uuid("id").unique().primary();
    table.string("email").notNullable();
    table.string("feature_type").notNullable();
    table.json("feature_options");
    table.uuid("user_id").references("id").inTable("users");
    table.timestamp("created_at").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users_feature_alerts");
}
