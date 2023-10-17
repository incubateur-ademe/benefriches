import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("carbon_storage", function (t) {
    t.increments("id").primary();
    t.string("reservoir").notNullable();
    t.string("soil_category").notNullable();
    t.string("stock_tC_by_ha").notNullable();
    t.string("localisation_category").notNullable();
    t.string("localisation_code").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("carbon_storage");
}
