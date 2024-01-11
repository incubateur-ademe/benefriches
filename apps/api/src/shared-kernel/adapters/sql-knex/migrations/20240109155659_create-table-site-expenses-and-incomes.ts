import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // expenses
  await knex.schema.createTable("site_expenses", function (table) {
    table.uuid("id").unique().primary();
    table.string("type").notNullable();
    table.string("bearer").notNullable();
    table.string("category").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.uuid("site_id").references("id").inTable("sites");
  });

  // incomes
  await knex.schema.createTable("site_incomes", function (table) {
    table.uuid("id").unique().primary();
    table.string("type").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.uuid("site_id").references("id").inTable("sites");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("site_expenses");
  await knex.schema.dropTableIfExists("site_incomes");
}
