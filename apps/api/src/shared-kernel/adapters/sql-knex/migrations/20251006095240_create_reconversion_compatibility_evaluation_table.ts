import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("reconversion_compatibility_evaluations", (table) => {
    table.uuid("id").unique().primary();
    table.uuid("created_by").notNullable();
    table.string("status");
    table.string("mutafriches_evaluation_id");
    table.timestamp("created_at").notNullable();
    table.timestamp("completed_at");
    table.jsonb("project_creations").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("reconversion_compatibility_evaluations");
}
