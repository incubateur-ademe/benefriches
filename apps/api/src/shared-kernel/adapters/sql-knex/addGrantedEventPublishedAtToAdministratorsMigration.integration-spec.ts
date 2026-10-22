import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";

import { ADMINISTRATOR_GRANTED } from "src/admin/core/events/administratorGranted.event";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import {
  down,
  up,
} from "./migrations/20261020140354_add-granted-event-published-at-to-administrators-table";

type AdministratorRow = {
  user_id: string;
  created_at: Date;
  granted_event_published_at: Date | null;
};

const insertUser = async (trx: Knex.Transaction, id: string, email: string): Promise<void> => {
  const createdAt = new Date("2026-01-01T00:00:00.000Z");
  await trx("users").insert({
    id,
    email,
    structure_activity: "urban_planner",
    structure_type: "company",
    created_at: createdAt,
    personal_data_storage_consented_at: createdAt,
  });
};

const selectAdministrators = (trx: Knex.Transaction): Promise<AdministratorRow[]> =>
  trx("administrators")
    .select("user_id", "created_at", "granted_event_published_at")
    .orderBy("user_id");

// The test database is already migrated to latest: each test reverts this migration, seeds the
// pre-migration schema and reruns it inside a transaction it rolls back, so the schema is restored.
describe("migration 20261020140354 add granted_event_published_at to administrators", () => {
  let sqlConnection: Knex;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("backfills granted_event_published_at with the created_at of the user's administrator.granted event and leaves administrators without one null", async () => {
    const trx = await sqlConnection.transaction();
    try {
      await down(trx);
      await insertUser(trx, "11111111-1111-4111-8111-111111111111", "granted@ademe.fr");
      await insertUser(trx, "22222222-2222-4222-8222-222222222222", "lost@ademe.fr");
      await trx("administrators").insert([
        {
          user_id: "11111111-1111-4111-8111-111111111111",
          created_at: new Date("2026-10-01T09:00:00.000Z"),
        },
        {
          user_id: "22222222-2222-4222-8222-222222222222",
          created_at: new Date("2026-10-02T09:00:00.000Z"),
        },
      ]);
      await trx("domain_events").insert({
        id: "event-granted-1",
        name: ADMINISTRATOR_GRANTED,
        payload: { userId: "11111111-1111-4111-8111-111111111111", userEmail: "granted@ademe.fr" },
        created_at: new Date("2026-10-01T09:00:05.000Z"),
      });

      await up(trx);

      assert.deepStrictEqual(await selectAdministrators(trx), [
        {
          user_id: "11111111-1111-4111-8111-111111111111",
          created_at: new Date("2026-10-01T09:00:00.000Z"),
          granted_event_published_at: new Date("2026-10-01T09:00:05.000Z"),
        },
        {
          user_id: "22222222-2222-4222-8222-222222222222",
          created_at: new Date("2026-10-02T09:00:00.000Z"),
          granted_event_published_at: null,
        },
      ] satisfies AdministratorRow[]);
    } finally {
      await trx.rollback();
    }
  });

  it("does not backfill from another event name or another user's administrator.granted event", async () => {
    const trx = await sqlConnection.transaction();
    try {
      await down(trx);
      await insertUser(trx, "33333333-3333-4333-8333-333333333333", "login-only@ademe.fr");
      await insertUser(trx, "44444444-4444-4444-8444-444444444444", "other-admin@ademe.fr");
      await trx("administrators").insert({
        user_id: "33333333-3333-4333-8333-333333333333",
        created_at: new Date("2026-10-03T09:00:00.000Z"),
      });
      await trx("domain_events").insert([
        {
          id: "event-login-3",
          name: LOGIN_SUCCEEDED,
          payload: {
            userId: "33333333-3333-4333-8333-333333333333",
            userEmail: "login-only@ademe.fr",
            method: "email-link",
          },
          created_at: new Date("2026-10-03T10:00:00.000Z"),
        },
        {
          id: "event-granted-4",
          name: ADMINISTRATOR_GRANTED,
          payload: {
            userId: "44444444-4444-4444-8444-444444444444",
            userEmail: "other-admin@ademe.fr",
          },
          created_at: new Date("2026-10-03T11:00:00.000Z"),
        },
      ]);

      await up(trx);

      assert.deepStrictEqual(await selectAdministrators(trx), [
        {
          user_id: "33333333-3333-4333-8333-333333333333",
          created_at: new Date("2026-10-03T09:00:00.000Z"),
          granted_event_published_at: null,
        },
      ] satisfies AdministratorRow[]);
    } finally {
      await trx.rollback();
    }
  });
});
