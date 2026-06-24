import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // expenses
  await knex.schema.createTable("reconversion_project_yearly_expenses", function (table) {
    table.uuid("id").unique().primary().notNullable();
    table.string("purpose").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table
      .uuid("reconversion_project_id")
      .references("id")
      .inTable("reconversion_projects")
      .notNullable();
  });

  // revenues
  await knex.schema.createTable("reconversion_project_yearly_revenues", function (table) {
    table.uuid("id").unique().primary().notNullable();
    table.string("source").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table
      .uuid("reconversion_project_id")
      .references("id")
      .inTable("reconversion_projects")
      .notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reconversion_project_yearly_expenses");
  await knex.schema.dropTableIfExists("reconversion_project_yearly_revenues");
}
