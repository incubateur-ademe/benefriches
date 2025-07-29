import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("verified_emails", (table) => {
    table.string("email").primary().notNullable();
    table.timestamp("verified_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("verified_emails");
}
