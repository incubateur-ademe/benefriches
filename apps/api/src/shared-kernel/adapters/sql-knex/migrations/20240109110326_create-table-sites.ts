import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("sites", function (table) {
    table.uuid("id").unique().primary();
    table.string("name").notNullable();
    table.string("description");
    table.decimal("surface_area", 12, 2).notNullable();
    table.boolean("is_friche").notNullable();
    table.decimal("full_time_jobs_involved", 6, 2);
    table.string("owner_structure_type").notNullable();
    table.string("owner_name");
    table.string("tenant_structure_type");
    table.string("tenant_name");
    // friche related
    table.string("friche_activity");
    table.boolean("friche_has_contaminated_soils");
    table.decimal("friche_contaminated_soil_surface_area", 12, 2);
    table.integer("friche_accidents_minor_injuries");
    table.integer("friche_accidents_severe_injuries");
    table.integer("friche_accidents_deaths");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("sites");
}
