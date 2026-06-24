import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("site_soils_distributions", function (table) {
    table.uuid("id").unique().primary();
    table.string("soil_type").notNullable();
    table.decimal("surface_area", 12, 2).notNullable();
    table.uuid("site_id").references("id").inTable("sites");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("site_soils_distributions");
}
