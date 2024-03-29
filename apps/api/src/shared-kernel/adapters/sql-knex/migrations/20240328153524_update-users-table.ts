import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("users", function (t) {
    t.string("firstname");
    t.string("lastname");
    t.string("structure_type");
    t.string("structure_name");
    t.timestamp("created_at").notNullable();
    t.timestamp("personal_data_storage_consented_at").notNullable();
    t.timestamp("personal_data_analytics_use_consented_at");
    t.timestamp("personal_data_communication_use_consented_at");
    t.dropColumn("password");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("users", function (t) {
    t.dropColumn("firstname");
    t.dropColumn("lastname");
    t.dropColumn("structure_type");
    t.dropColumn("structure_name");
    t.dropColumn("created_at");
    t.dropColumn("personal_data_storage_consented_at");
    t.dropColumn("personal_data_analytics_use_consented_at");
    t.dropColumn("personal_data_communication_use_consented_at");
    t.string("password").notNullable();
  });
}
