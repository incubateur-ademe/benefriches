import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table("lifecycle_email_deliveries", (table) => {
    // Every existing row had exactly one attempt (the inline send).
    table.integer("attempts").notNullable().defaultTo(1);
    // The retry sweeper judges a "pending" row stranded from its latest attempt,
    // not from created_at. Added nullable, backfilled, then made NOT NULL.
    table.timestamp("last_attempted_at");
  });

  await knex.raw("UPDATE lifecycle_email_deliveries SET last_attempted_at = created_at");

  await knex.schema.alterTable("lifecycle_email_deliveries", (table) => {
    table.dropNullable("last_attempted_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table("lifecycle_email_deliveries", (table) => {
    table.dropColumn("last_attempted_at");
    table.dropColumn("attempts");
  });
}
