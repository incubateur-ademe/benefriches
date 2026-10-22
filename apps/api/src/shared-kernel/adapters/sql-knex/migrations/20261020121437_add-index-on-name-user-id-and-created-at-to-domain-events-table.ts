import type { Knex } from "knex";

// CONCURRENTLY can't run inside a transaction, and a plain CREATE INDEX would block every
// event write to domain_events while the index builds. No IF NOT EXISTS: a failed concurrent
// build leaves an INVALID index that IF NOT EXISTS would silently keep on rerun.
export const config = { transaction: false };

export async function up(knex: Knex): Promise<void> {
  await knex.raw(
    `CREATE INDEX CONCURRENTLY domain_events_name_user_id_created_at_idx
     ON domain_events (name, (payload->>'userId'), created_at)`,
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw("DROP INDEX CONCURRENTLY IF EXISTS domain_events_name_user_id_created_at_idx");
}
