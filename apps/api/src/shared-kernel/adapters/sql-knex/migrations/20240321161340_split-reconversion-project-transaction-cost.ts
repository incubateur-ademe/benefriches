import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.dropColumn("real_estate_transaction_cost");
    table.decimal("real_estate_transaction_selling_price", 15, 2);
    table.decimal("real_estate_transaction_property_transfer_duties", 15, 2);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.decimal("real_estate_transaction_cost", 15, 2);
    table.dropColumn("real_estate_transaction_selling_price");
    table.dropColumn("real_estate_transaction_property_transfer_duties");
  });
}
