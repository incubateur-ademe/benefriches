import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlLifecycleEmailSubscriptionRepository } from "./SqlLifecycleEmailSubscriptionRepository";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");

describe("SqlLifecycleEmailSubscriptionRepository integration", () => {
  let sqlConnection: Knex;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  const getUnsubscribedAt = async (userId: string) => {
    const row = await sqlConnection("users")
      .select("lifecycle_emails_unsubscribed_at")
      .where("id", userId)
      .first();
    return row?.lifecycle_emails_unsubscribed_at;
  };

  it("sets the unsubscribe timestamp on a subscribed user", async () => {
    const user = new UserBuilder().withEmail("subscribed@example.fr").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      lifecycle_emails_unsubscribed_at: null,
    });
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    await repository.markUnsubscribed(user.id, fakeNow);

    assert.deepStrictEqual(await getUnsubscribedAt(user.id), fakeNow);
  });

  it("keeps the first timestamp when called again", async () => {
    const firstUnsubscribedAt = new Date("2025-06-01T08:00:00.000Z");
    const user = new UserBuilder().withEmail("already-unsubscribed@example.fr").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      lifecycle_emails_unsubscribed_at: firstUnsubscribedAt,
    });
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    await repository.markUnsubscribed(user.id, fakeNow);

    assert.deepStrictEqual(await getUnsubscribedAt(user.id), firstUnsubscribedAt);
  });

  it("reports a change when it records the first unsubscribe", async () => {
    const user = new UserBuilder().withEmail("subscribed@example.fr").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      lifecycle_emails_unsubscribed_at: null,
    });
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    const result = await repository.markUnsubscribed(user.id, fakeNow);

    assert.strictEqual(result, true);
  });

  it("reports no change for an already unsubscribed user", async () => {
    const user = new UserBuilder().withEmail("already-unsubscribed@example.fr").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      lifecycle_emails_unsubscribed_at: new Date("2025-06-01T08:00:00.000Z"),
    });
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    const result = await repository.markUnsubscribed(user.id, fakeNow);

    assert.strictEqual(result, false);
  });

  it("leaves other users untouched", async () => {
    const userA = new UserBuilder().withEmail("user-a@example.fr").build();
    const userB = new UserBuilder().withEmail("user-b@example.fr").build();
    await sqlConnection("users").insert([
      { ...mapUserToSqlRow(userA), lifecycle_emails_unsubscribed_at: null },
      { ...mapUserToSqlRow(userB), lifecycle_emails_unsubscribed_at: null },
    ]);
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    await repository.markUnsubscribed(userA.id, fakeNow);

    assert.strictEqual(await getUnsubscribedAt(userB.id), null);
  });

  it("does nothing for an unknown user id", async () => {
    const user = new UserBuilder().withEmail("existing@example.fr").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    await repository.markUnsubscribed(uuid(), fakeNow);

    const usersCount = await sqlConnection.raw<{ rows: { count: number }[] }>(
      "SELECT COUNT(*)::int AS count FROM users",
    );
    assert.deepStrictEqual(usersCount.rows, [{ count: 1 }]);
  });

  it("reports no change for an unknown user", async () => {
    const user = new UserBuilder().withEmail("existing@example.fr").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    const repository = new SqlLifecycleEmailSubscriptionRepository(sqlConnection);

    const result = await repository.markUnsubscribed(uuid(), fakeNow);

    assert.strictEqual(result, false);
  });
});
