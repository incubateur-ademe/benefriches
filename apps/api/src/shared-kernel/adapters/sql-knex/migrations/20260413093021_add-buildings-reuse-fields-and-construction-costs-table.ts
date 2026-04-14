import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_project_development_plans", (table) => {
    table.boolean("developer_will_be_buildings_constructor");
  });

  await knex.schema.createTable("reconversion_project_buildings_construction_costs", (table) => {
    table.uuid("id").unique().primary().notNullable();
    table.string("purpose").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table
      .uuid("development_plan_id")
      .references("id")
      .inTable("reconversion_project_development_plans")
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reconversion_project_buildings_construction_costs");

  await knex.schema.table("reconversion_project_development_plans", (table) => {
    table.dropColumn("developer_will_be_buildings_constructor");
  });
}
