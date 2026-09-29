import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { RetryLifecycleEmailDeliveriesUseCase } from "src/notifications/core/usecases/retryLifecycleEmailDeliveries.usecase";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SqlLifecycleEmailDelivery } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { UserBuilder } from "src/users/core/model/user.mock";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");
const aDayBefore = new Date("2025-12-31T10:00:00.000Z");

describe("RetryLifecycleEmailDeliveries integration test", () => {
  // One app for the whole suite: test apps share the SqlConnectionModule's Knex pool.
  let fakeMailer: FakeMailer;
  let app: NestExpressApplication;
  let sqlConnection: Knex;

  before(async () => {
    fakeMailer = new FakeMailer();

    app = await createTestApp({
      providerOverrides: [
        { token: SmtpMailer, useValue: fakeMailer },
        { token: RealDateProvider, useValue: new DeterministicDateProvider(fakeNow) },
      ],
    });
    await app.init();

    sqlConnection = app.get(SqlConnection);
  });

  beforeEach(() => {
    fakeMailer._reset();
  });

  after(async () => {
    await app.close();
  });

  const insertUser = async (options: { unsubscribedAt: Date | null }) => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail("john.doe@example.com").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      lifecycle_emails_unsubscribed_at: options.unsubscribedAt,
    });
    return userId;
  };

  const deliveriesOf = (userId: string) =>
    sqlConnection("lifecycle_email_deliveries").where("user_id", userId);

  it("retries a failed welcome delivery and records it sent on the same row", async () => {
    const userId = await insertUser({ unsubscribedAt: null });
    const deliveryId = uuid();
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: deliveryId,
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "failed",
      created_at: aDayBefore,
      sent_at: null,
      error_message: "SMTP down",
      attempts: 1,
      last_attempted_at: aDayBefore,
    });

    await app.get(RetryLifecycleEmailDeliveriesUseCase).execute();

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    assert.strictEqual(fakeMailer.sentEmails[0]?.to, "john.doe@example.com");
    assert.strictEqual(fakeMailer.sentEmails[0]?.subject, "Bienvenue chez Bénéfriches");
    const expectedUnsubscribeUrl = buildUnsubscribeUrl(
      app.get(ConfigService).getOrThrow<string>("WEBAPP_URL"),
      app.get(HmacUnsubscribeTokenService).sign(userId),
    );
    assert.ok(fakeMailer.sentEmails[0]?.text.includes(expectedUnsubscribeUrl));
    assert.deepStrictEqual(await deliveriesOf(userId), [
      {
        id: deliveryId,
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "sent",
        created_at: aDayBefore,
        sent_at: fakeNow,
        error_message: "SMTP down",
        attempts: 2,
        last_attempted_at: fakeNow,
      },
    ] satisfies SqlLifecycleEmailDelivery[]);
  });

  it("leaves a fresh pending delivery alone", async () => {
    const userId = await insertUser({ unsubscribedAt: null });
    const freshPending: SqlLifecycleEmailDelivery = {
      id: uuid(),
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "pending",
      created_at: new Date("2026-01-01T09:59:00.000Z"),
      sent_at: null,
      error_message: null,
      attempts: 1,
      last_attempted_at: new Date("2026-01-01T09:59:00.000Z"),
    };
    await sqlConnection("lifecycle_email_deliveries").insert(freshPending);

    await app.get(RetryLifecycleEmailDeliveriesUseCase).execute();

    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await deliveriesOf(userId), [freshPending]);
  });

  it("retries a stale pending delivery", async () => {
    const userId = await insertUser({ unsubscribedAt: null });
    const deliveryId = uuid();
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: deliveryId,
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "pending",
      created_at: new Date("2026-01-01T09:40:00.000Z"),
      sent_at: null,
      error_message: null,
      attempts: 1,
      last_attempted_at: new Date("2026-01-01T09:40:00.000Z"),
    });

    await app.get(RetryLifecycleEmailDeliveriesUseCase).execute();

    assert.deepStrictEqual(
      fakeMailer.sentEmails.map((email) => email.to),
      ["john.doe@example.com"],
    );
    assert.deepStrictEqual(await deliveriesOf(userId), [
      {
        id: deliveryId,
        user_id: userId,
        email_type: "welcome",
        related_entity_id: null,
        status: "sent",
        created_at: new Date("2026-01-01T09:40:00.000Z"),
        sent_at: fakeNow,
        error_message: null,
        attempts: 2,
        last_attempted_at: fakeNow,
      },
    ] satisfies SqlLifecycleEmailDelivery[]);
  });

  it("skips an abandoned (attempt-capped) delivery", async () => {
    const userId = await insertUser({ unsubscribedAt: null });
    const abandoned: SqlLifecycleEmailDelivery = {
      id: uuid(),
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "abandoned",
      created_at: aDayBefore,
      sent_at: null,
      error_message: "Mailbox unavailable",
      attempts: 5,
      last_attempted_at: new Date("2026-01-01T08:00:00.000Z"),
    };
    await sqlConnection("lifecycle_email_deliveries").insert(abandoned);

    await app.get(RetryLifecycleEmailDeliveriesUseCase).execute();

    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await deliveriesOf(userId), [abandoned]);
  });

  it("skips a failed delivery for a user who has since unsubscribed", async () => {
    const userId = await insertUser({ unsubscribedAt: new Date("2025-12-31T12:00:00.000Z") });
    const failed: SqlLifecycleEmailDelivery = {
      id: uuid(),
      user_id: userId,
      email_type: "welcome",
      related_entity_id: null,
      status: "failed",
      created_at: aDayBefore,
      sent_at: null,
      error_message: "SMTP down",
      attempts: 1,
      last_attempted_at: aDayBefore,
    };
    await sqlConnection("lifecycle_email_deliveries").insert(failed);

    await app.get(RetryLifecycleEmailDeliveriesUseCase).execute();

    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await deliveriesOf(userId), [failed]);
  });
  it("retries a failed first project reminder, loading the site from the delivery", async () => {
    const userId = await insertUser({ unsubscribedAt: null });
    const siteId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: userId,
      name: "Ancienne carrière d’argile de Blajan",
      nature: "FRICHE",
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: "custom",
      status: "active",
      created_at: new Date("2025-12-30T20:00:00.000Z"),
    });
    const deliveryId = uuid();
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: deliveryId,
      user_id: userId,
      email_type: "first-project-reminder",
      related_entity_id: siteId,
      status: "failed",
      created_at: aDayBefore,
      sent_at: null,
      error_message: "SMTP down",
      attempts: 1,
      last_attempted_at: new Date("2026-01-01T09:00:00.000Z"),
    });

    await app.get(RetryLifecycleEmailDeliveriesUseCase).execute();

    assert.deepStrictEqual(
      fakeMailer.sentEmails.map((email) => email.subject),
      [
        "Ancienne carrière d’argile de Blajan : et si vous renseigniez votre projet d’aménagement ?",
      ],
    );
    assert.deepStrictEqual(await deliveriesOf(userId), [
      {
        id: deliveryId,
        user_id: userId,
        email_type: "first-project-reminder",
        related_entity_id: siteId,
        status: "sent",
        created_at: aDayBefore,
        sent_at: fakeNow,
        error_message: "SMTP down",
        attempts: 2,
        last_attempted_at: fakeNow,
      },
    ] satisfies SqlLifecycleEmailDelivery[]);
  });
});
