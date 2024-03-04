import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.string("future_site_owner_name");
    table.string("future_site_owner_structure_type");
    table.decimal("real_estate_transaction_cost", 15, 2);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", (table) => {
    table.dropColumn("future_site_owner_name");
    table.dropColumn("future_site_owner_structure_type");
    table.dropColumn("real_estate_transaction_cost");
  });
}
