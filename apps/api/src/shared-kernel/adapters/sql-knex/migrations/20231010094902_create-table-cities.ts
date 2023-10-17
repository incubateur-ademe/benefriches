import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("cities", function (t) {
    t.increments("id").primary();
    t.string("insee").primary().notNullable();
    t.string("name").notNullable();
    t.string("department").notNullable();
    t.string("region").notNullable();
    t.string("zpc").notNullable();
    t.string("epci").notNullable();
    t.specificType("code_ser", "text ARRAY");
    t.specificType("code_groupeser", "text ARRAY");
    t.specificType("code_greco", "text ARRAY");
    t.string("code_rad13");
    t.string("code_bassin_populicole");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("cities");
}
