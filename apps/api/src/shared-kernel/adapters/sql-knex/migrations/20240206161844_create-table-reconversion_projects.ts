import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reconversion_projects", function (table) {
    table.uuid("id").unique().primary().notNullable();
    table.string("name").notNullable();
    table.string("description");
    table.uuid("related_site_id").references("id").inTable("sites").notNullable();
    // future operations
    table.string("future_operator_name");
    table.string("future_operator_structure_type");
    table.decimal("future_operations_full_time_jobs", 6, 2);
    // reinstatement
    table.string("reinstatement_contract_owner_name");
    table.string("reinstatement_contract_owner_structure_type");
    table.decimal("reinstatement_cost", 15, 2);
    table.decimal("reinstatement_full_time_jobs_involved", 6, 2);
    // conversion
    table.decimal("conversion_full_time_jobs_involved", 6, 2);
    table.decimal("financial_assistance_amount", 15, 2);
    // dates
    table.timestamp("created_at").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reconversion_projects");
}
