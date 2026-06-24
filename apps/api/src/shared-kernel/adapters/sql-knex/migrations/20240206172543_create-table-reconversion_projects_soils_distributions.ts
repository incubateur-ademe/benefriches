import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reconversion_project_soils_distributions", function (table) {
    table.uuid("id").unique().primary().notNullable();
    table.string("soil_type").notNullable();
    table.decimal("surface_area", 12, 2).notNullable();
    table
      .uuid("reconversion_project_id")
      .references("id")
      .inTable("reconversion_projects")
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reconversion_project_soils_distributions");
}
