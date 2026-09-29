import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import request from "supertest";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import { createUserAccountCreatedEvent } from "src/auth/core/events/userAccountCreated.event";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UserBuilder } from "src/users/core/model/user.mock";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");

describe("SendWelcomeEmailOnUserAccountCreatedHandler integration test", () => {
  // A single app (and its SqlConnection pool) for the whole suite — NestJS test apps in
  // this codebase share the SqlConnectionModule's Knex pool as a process-wide singleton,
  // so closing an app after every test would tear down the pool underneath sibling tests.
  let eventPublisher: DomainEventPublisher;
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

    eventPublisher = app.get(RealEventPublisher);
    sqlConnection = app.get(SqlConnection);
  });

  beforeEach(() => {
    fakeMailer._reset();
  });

  after(async () => {
    await app.close();
  });

  it("sends the welcome email and records a sent delivery when the account-created event fires", async () => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail("john.doe@example.com").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));

    await eventPublisher.publish(
      createUserAccountCreatedEvent("event-1", {
        userId,
        userEmail: "john.doe@example.com",
        userFirstName: "John",
        userLastName: "Doe",
        subscribedToNewsletter: false,
      }),
    );

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    assert.strictEqual(fakeMailer.sentEmails[0]?.to, "john.doe@example.com");
    assert.strictEqual(fakeMailer.sentEmails[0]?.subject, "Bienvenue chez Bénéfriches");

    const deliveries = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(deliveries.length, 1);
    assert.strictEqual(deliveries[0]?.status, "sent");
  });

  it("does not send a second email when the account-created event is replayed for the same user", async () => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail("john.doe@example.com").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    const event = createUserAccountCreatedEvent("event-1", {
      userId,
      userEmail: "john.doe@example.com",
      userFirstName: "John",
      userLastName: "Doe",
      subscribedToNewsletter: false,
    });

    await eventPublisher.publish(event);
    await eventPublisher.publish(event);

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    const deliveries = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(deliveries.length, 1);
  });

  it("does not send when the user has unsubscribed from lifecycle emails", async () => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail("john.doe@example.com").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    await sqlConnection("users")
      .where("id", userId)
      .update({ lifecycle_emails_unsubscribed_at: new Date("2025-12-01") });

    await eventPublisher.publish(
      createUserAccountCreatedEvent("event-1", {
        userId,
        userEmail: "john.doe@example.com",
        userFirstName: "John",
        userLastName: "Doe",
        subscribedToNewsletter: false,
      }),
    );

    assert.strictEqual(fakeMailer.sentEmails.length, 0);
    const deliveries = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(deliveries.length, 0);
  });

  it("does not let a mailer failure propagate out of registration", async () => {
    fakeMailer.simulateFailure("SMTP unreachable");
    const userId = uuid();

    const response = await request(app.getHttpServer()).post("/api/auth/register").send({
      id: userId,
      firstName: "John",
      lastName: "Doe",
      email: "user@collectivite.fr",
      structureActivity: "urban_planner",
      structureType: "company",
      personalDataAnalyticsUseConsented: false,
      personalDataCommunicationUseConsented: false,
      personalDataStorageConsented: true,
      subscribedToNewsletter: true,
    });

    assert.strictEqual(response.status, 201);

    const usersInDb = await sqlConnection("users").where("email", "user@collectivite.fr");
    assert.strictEqual(usersInDb.length, 1);

    const deliveries = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(deliveries.length, 1);
    assert.strictEqual(deliveries[0]?.status, "failed");
    assert.ok(deliveries[0]?.error_message);
  });
});
