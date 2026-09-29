import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
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
      attempts: 1,
      last_attempted_at: new Date(),
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
      attempts: 1,
      last_attempted_at: new Date(),
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
      attempts: 1,
      last_attempted_at: new Date(),
    });

    const result = await query.hasDelivery({
      userId,
      emailType: "welcome",
      relatedEntityId: siteAId,
    });

    assert.strictEqual(result, true);
  });

  describe("findRetryCandidates", () => {
    const stalePendingBefore = new Date("2026-01-01T09:45:00.000Z");

    it("returns a failed delivery, mapped to the domain shape", async () => {
      const userId = await insertUser();
      const deliveryId = uuid();
      await sqlConnection("lifecycle_email_deliveries").insert({
        id: deliveryId,
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "failed",
        created_at: new Date("2025-12-31T10:00:00.000Z"),
        sent_at: null,
        error_message: "SMTP down",
        attempts: 2,
        last_attempted_at: new Date("2026-01-01T08:00:00.000Z"),
      });

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, [
        {
          id: deliveryId,
          userId,
          emailType: "welcome",
          relatedEntityId: null,
          status: "failed",
          createdAt: new Date("2025-12-31T10:00:00.000Z"),
          sentAt: null,
          errorMessage: "SMTP down",
          attempts: 2,
          lastAttemptedAt: new Date("2026-01-01T08:00:00.000Z"),
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("returns a pending delivery last attempted before the staleness bound", async () => {
      const userId = await insertUser();
      const deliveryId = uuid();
      await sqlConnection("lifecycle_email_deliveries").insert({
        id: deliveryId,
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "pending",
        created_at: new Date("2026-01-01T09:44:00.000Z"),
        sent_at: null,
        error_message: null,
        attempts: 1,
        last_attempted_at: new Date("2026-01-01T09:44:00.000Z"),
      });

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, [
        {
          id: deliveryId,
          userId,
          emailType: "welcome",
          relatedEntityId: null,
          status: "pending",
          createdAt: new Date("2026-01-01T09:44:00.000Z"),
          sentAt: null,
          errorMessage: null,
          attempts: 1,
          lastAttemptedAt: new Date("2026-01-01T09:44:00.000Z"),
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("skips a pending delivery last attempted after the staleness bound", async () => {
      const userId = await insertUser();
      await sqlConnection("lifecycle_email_deliveries").insert({
        id: uuid(),
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "pending",
        created_at: new Date("2026-01-01T09:50:00.000Z"),
        sent_at: null,
        error_message: null,
        attempts: 1,
        last_attempted_at: new Date("2026-01-01T09:50:00.000Z"),
      });

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, []);
    });

    it("judges staleness on the last attempt, not on creation", async () => {
      const userId = await insertUser();
      await sqlConnection("lifecycle_email_deliveries").insert({
        id: uuid(),
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "pending",
        created_at: new Date("2025-12-31T10:00:00.000Z"),
        sent_at: null,
        error_message: "SMTP down",
        attempts: 2,
        last_attempted_at: new Date("2026-01-01T09:50:00.000Z"),
      });

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, []);
    });

    it("skips sent and abandoned deliveries", async () => {
      const sentUserId = await insertUser();
      const abandonedUserId = await insertUser();
      await sqlConnection("lifecycle_email_deliveries").insert([
        {
          id: uuid(),
          user_id: sentUserId,
          email_type: "welcome",
          related_entity_id: null,
          status: "sent",
          created_at: new Date("2025-12-31T10:00:00.000Z"),
          sent_at: new Date("2025-12-31T10:00:00.000Z"),
          error_message: null,
          attempts: 1,
          last_attempted_at: new Date("2025-12-31T10:00:00.000Z"),
        },
        {
          id: uuid(),
          user_id: abandonedUserId,
          email_type: "welcome",
          related_entity_id: null,
          status: "abandoned",
          created_at: new Date("2025-12-31T10:00:00.000Z"),
          sent_at: null,
          error_message: "Mailbox unavailable",
          attempts: 5,
          last_attempted_at: new Date("2026-01-01T08:00:00.000Z"),
        },
      ]);

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, []);
    });

    it("skips deliveries of users who unsubscribed", async () => {
      const user = new UserBuilder().build();
      await sqlConnection("users").insert({
        ...mapUserToSqlRow(user),
        lifecycle_emails_unsubscribed_at: new Date("2025-12-31T12:00:00.000Z"),
      });
      await sqlConnection("lifecycle_email_deliveries").insert({
        id: uuid(),
        user_id: user.id,
        email_type: "welcome",
        related_entity_id: null,
        status: "failed",
        created_at: new Date("2025-12-31T10:00:00.000Z"),
        sent_at: null,
        error_message: "SMTP down",
        attempts: 1,
        last_attempted_at: new Date("2025-12-31T10:00:00.000Z"),
      });

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, []);
    });

    it("skips a delivery with an email type the code doesn't know", async () => {
      const userId = await insertUser();
      await sqlConnection("lifecycle_email_deliveries").insert({
        id: uuid(),
        user_id: userId,
        email_type: "retired-type",
        related_entity_id: null,
        status: "failed",
        created_at: new Date("2025-12-31T10:00:00.000Z"),
        sent_at: null,
        error_message: "SMTP down",
        attempts: 1,
        last_attempted_at: new Date("2025-12-31T10:00:00.000Z"),
      });

      const result = await query.findRetryCandidates({ stalePendingBefore });

      assert.deepStrictEqual(result, []);
    });
  });
});
