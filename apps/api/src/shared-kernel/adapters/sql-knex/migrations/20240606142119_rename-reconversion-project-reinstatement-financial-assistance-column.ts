import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.renameColumn(
      "reinstatement_financial_assistance_amount",
      "financial_assistance_revenues",
    );
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("reconversion_projects", function (table) {
    table.renameColumn(
      "financial_assistance_revenues",
      "reinstatement_financial_assistance_amount",
    );
  });
}
