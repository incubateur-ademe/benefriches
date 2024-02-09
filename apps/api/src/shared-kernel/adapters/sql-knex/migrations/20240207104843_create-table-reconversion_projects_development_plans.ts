import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reconversion_project_development_plans", function (table) {
    table.uuid("id").unique().primary().notNullable();
    table.string("type").notNullable();
    table.decimal("surface_area", 12, 2).notNullable();
    table.decimal("cost", 15, 2);
    table.json("features").notNullable();
    table
      .uuid("reconversion_project_id")
      .references("id")
      .inTable("reconversion_projects")
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reconversion_project_development_plans");
}
