import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import type { LifecycleEmailRecipient } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlLifecycleEmailRecipientQuery } from "./SqlLifecycleEmailRecipientQuery";

describe("SqlLifecycleEmailRecipientQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlLifecycleEmailRecipientQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlLifecycleEmailRecipientQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("returns the recipient with unsubscribedAt null for a fresh user", async () => {
    const user = new UserBuilder()
      .withEmail("fresh@example.fr")
      .withFirstName("John")
      .withLastName("Doe")
      .build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));

    const result = await query.getById(user.id);

    assert.deepStrictEqual(result, {
      id: user.id,
      email: "fresh@example.fr",
      firstName: "John",
      lastName: "Doe",
      unsubscribedAt: null,
    } satisfies LifecycleEmailRecipient);
  });

  it("returns the timestamp when lifecycle_emails_unsubscribed_at is set", async () => {
    const user = new UserBuilder()
      .withEmail("unsubscribed@example.fr")
      .withFirstName("John")
      .withLastName("Doe")
      .build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    const unsubscribedAt = new Date("2026-02-01T00:00:00.000Z");
    await sqlConnection("users")
      .where("id", user.id)
      .update({ lifecycle_emails_unsubscribed_at: unsubscribedAt });

    const result = await query.getById(user.id);

    assert.deepStrictEqual(result, {
      id: user.id,
      email: "unsubscribed@example.fr",
      firstName: "John",
      lastName: "Doe",
      unsubscribedAt,
    } satisfies LifecycleEmailRecipient);
  });

  it("maps missing first and last names to null", async () => {
    const user = new UserBuilder().withEmail("legacy@example.fr").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      firstname: null,
      lastname: null,
    });

    const result = await query.getById(user.id);

    assert.deepStrictEqual(result, {
      id: user.id,
      email: "legacy@example.fr",
      firstName: null,
      lastName: null,
      unsubscribedAt: null,
    } satisfies LifecycleEmailRecipient);
  });

  it("returns undefined when the user does not exist", async () => {
    const result = await query.getById(uuid());

    assert.strictEqual(result, undefined);
  });
});
