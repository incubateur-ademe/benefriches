import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("site_urban_zone_features", (table) => {
    table.uuid("id").primary();
    table.uuid("site_id").notNullable().references("id").inTable("sites").unique();
    table.string("urban_zone_type", 50).notNullable();
    table.jsonb("land_parcels").notNullable();
    table.boolean("has_contaminated_soils");
    table.decimal("contaminated_soil_surface", 12, 2);
    table.string("manager_structure_type", 50).notNullable();
    table.string("manager_name", 255).notNullable();
    table.decimal("vacant_commercial_premises_footprint", 12, 2).notNullable();
    table.decimal("vacant_commercial_premises_floor_area", 12, 2);
    table.decimal("full_time_jobs_equivalent", 10, 2);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("site_urban_zone_features");
}
