import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { assertShapeEquals, isDate } from "test/assertShapeEquals";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUsersRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlLifecycleEmailDeliveryRepository } from "./SqlLifecycleEmailDeliveryRepository";

describe("SqlLifecycleEmailDeliveryRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlLifecycleEmailDeliveryRepository;
  let userId: string;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    repository = new SqlLifecycleEmailDeliveryRepository(sqlConnection);
    const user = new UserBuilder().build();
    userId = user.id;
    await sqlConnection("users").insert(mapUserToSqlRow(user));
  });

  it("writes a pending delivery row on save", async () => {
    const deliveryId = uuid();

    await repository.save({
      id: deliveryId,
      userId,
      emailType: "welcome",
      relatedEntityId: null,
      status: "pending",
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
      sentAt: null,
      errorMessage: null,
    });

    const rows = await sqlConnection("lifecycle_email_deliveries").select().where("id", deliveryId);
    assert.strictEqual(rows.length, 1);
    const [row] = rows;
    assert.ok(row);
    assert.deepStrictEqual(row, {
      id: deliveryId,
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "pending",
      created_at: new Date("2026-01-01T10:00:00.000Z"),
      sent_at: null,
      error_message: null,
    });
  });

  it("sets status to sent and records sent_at on markSent, leaving error_message null", async () => {
    const deliveryId = uuid();
    await repository.save({
      id: deliveryId,
      userId,
      emailType: "welcome",
      relatedEntityId: null,
      status: "pending",
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
      sentAt: null,
      errorMessage: null,
    });

    await repository.markSent(deliveryId, new Date("2026-01-01T10:05:00.000Z"));

    const row = await sqlConnection("lifecycle_email_deliveries").where("id", deliveryId).first();
    assert.ok(row);
    assertShapeEquals(
      row,
      {
        id: deliveryId,
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "sent",
        error_message: null,
      },
      { created_at: isDate, sent_at: isDate },
    );
    assert.deepStrictEqual(row.sent_at, new Date("2026-01-01T10:05:00.000Z"));
  });

  it("sets status to failed and records error_message on markFailed, leaving sent_at null", async () => {
    const deliveryId = uuid();
    await repository.save({
      id: deliveryId,
      userId,
      emailType: "welcome",
      relatedEntityId: null,
      status: "pending",
      createdAt: new Date("2026-01-01T10:00:00.000Z"),
      sentAt: null,
      errorMessage: null,
    });

    await repository.markFailed(deliveryId, "SMTP unreachable");

    const row = await sqlConnection("lifecycle_email_deliveries").where("id", deliveryId).first();
    assert.ok(row);
    assertShapeEquals(
      row,
      {
        id: deliveryId,
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "failed",
        sent_at: null,
        error_message: "SMTP unreachable",
      },
      { created_at: isDate },
    );
  });

  it("rejects a second account-scoped delivery for the same user and type (partial unique index)", async () => {
    await repository.save({
      id: uuid(),
      userId,
      emailType: "welcome",
      relatedEntityId: null,
      status: "sent",
      createdAt: new Date(),
      sentAt: new Date(),
      errorMessage: null,
    });

    await assert.rejects(() =>
      repository.save({
        id: uuid(),
        userId,
        emailType: "welcome",
        relatedEntityId: null,
        status: "pending",
        createdAt: new Date(),
        sentAt: null,
        errorMessage: null,
      }),
    );

    const rows = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(rows.length, 1);
  });

  it("rejects a second entity-scoped delivery for the same user, type and entity, but allows a different entity (partial unique index)", async () => {
    const siteAId = uuid();
    const siteBId = uuid();

    await repository.save({
      id: uuid(),
      userId,
      emailType: "welcome",
      relatedEntityId: siteAId,
      status: "sent",
      createdAt: new Date(),
      sentAt: new Date(),
      errorMessage: null,
    });

    await repository.save({
      id: uuid(),
      userId,
      emailType: "welcome",
      relatedEntityId: siteBId,
      status: "sent",
      createdAt: new Date(),
      sentAt: new Date(),
      errorMessage: null,
    });

    await assert.rejects(() =>
      repository.save({
        id: uuid(),
        userId,
        emailType: "welcome",
        relatedEntityId: siteAId,
        status: "pending",
        createdAt: new Date(),
        sentAt: null,
        errorMessage: null,
      }),
    );

    const rows = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(rows.length, 2);
  });
});
