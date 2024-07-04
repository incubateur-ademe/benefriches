import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.decimal("site_resale_expected_selling_price", 15, 2);
    table.decimal("site_resale_expected_property_transfer_duties", 15, 2);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.dropColumn("site_resale_expected_selling_price");
    table.dropColumn("site_resale_expected_property_transfer_duties");
  });
}
