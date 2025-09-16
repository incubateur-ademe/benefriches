import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("domain_events", (table) => {
    table.string("id").primary().notNullable();
    table.string("name").notNullable();
    table.jsonb("payload").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("domain_events");
}
