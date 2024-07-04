import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.renameColumn("real_estate_transaction_selling_price", "site_purchase_selling_price");
    table.renameColumn(
      "real_estate_transaction_property_transfer_duties",
      "site_purchase_property_transfer_duties",
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.renameColumn("site_purchase_selling_price", "real_estate_transaction_selling_price");
    table.renameColumn(
      "site_purchase_property_transfer_duties",
      "real_estate_transaction_property_transfer_duties",
    );
  });
}
