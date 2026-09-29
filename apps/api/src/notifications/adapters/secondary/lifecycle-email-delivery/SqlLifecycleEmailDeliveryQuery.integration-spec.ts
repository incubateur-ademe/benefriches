import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlLifecycleEmailDeliveryQuery } from "./SqlLifecycleEmailDeliveryQuery";

describe("SqlLifecycleEmailDeliveryQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlLifecycleEmailDeliveryQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlLifecycleEmailDeliveryQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  const insertUser = async () => {
    const user = new UserBuilder().build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    return user.id;
  };

  it("returns true for an existing account-scoped (NULL related_entity_id) delivery", async () => {
    const userId = await insertUser();
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: uuid(),
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "sent",
      created_at: new Date(),
      sent_at: new Date(),
      error_message: null,
    });

    const result = await query.hasDelivery({ userId, emailType: "welcome", relatedEntityId: null });

    assert.strictEqual(result, true);
  });

  it("returns false when only a delivery for a different related_entity_id exists", async () => {
    const userId = await insertUser();
    const siteAId = uuid();
    const siteBId = uuid();
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: uuid(),
      user_id: userId,
      email_type: "welcome",
      related_entity_id: siteAId,
      status: "sent",
      created_at: new Date(),
      sent_at: new Date(),
      error_message: null,
    });

    const result = await query.hasDelivery({
      userId,
      emailType: "welcome",
      relatedEntityId: siteBId,
    });

    assert.strictEqual(result, false);
  });

  it("returns true for an existing entity-scoped delivery", async () => {
    const userId = await insertUser();
    const siteAId = uuid();
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: uuid(),
      user_id: userId,
      email_type: "welcome",
      related_entity_id: siteAId,
      status: "sent",
      created_at: new Date(),
      sent_at: new Date(),
      error_message: null,
    });

    const result = await query.hasDelivery({
      userId,
      emailType: "welcome",
      relatedEntityId: siteAId,
    });

    assert.strictEqual(result, true);
  });
});
