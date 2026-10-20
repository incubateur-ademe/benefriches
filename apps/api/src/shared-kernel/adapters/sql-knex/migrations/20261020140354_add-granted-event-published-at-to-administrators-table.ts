import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("administrators", (table) => {
    table.timestamp("granted_event_published_at").nullable();
  });

  // Grants whose administrator.granted event was stored count as published. The others are the
  // grants whose event was lost: they stay null so the next grant script run publishes it.
  await knex.raw(`
    UPDATE administrators a
    SET granted_event_published_at = e.created_at
    FROM domain_events e
    WHERE e.name = 'administrator.granted'
      AND e.payload->>'userId' = a.user_id::text
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("administrators", (table) => {
    table.dropColumn("granted_event_published_at");
  });
}
