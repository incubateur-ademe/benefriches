import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("addresses", function (table) {
    table.uuid("id").unique().primary();
    table.string("ban_id").notNullable();
    table.string("value").notNullable();
    table.string("city").notNullable();
    table.string("city_code").notNullable();
    table.string("post_code").notNullable();
    table.string("street_number");
    table.string("street_name");
    table.decimal("long", 10, 6);
    table.decimal("lat", 10, 6);
    table.uuid("site_id").references("id").inTable("sites");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("addresses");
}
