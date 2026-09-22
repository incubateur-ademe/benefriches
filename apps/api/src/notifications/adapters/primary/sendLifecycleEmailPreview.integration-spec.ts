import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUsersRepository";
import { createUserAccountCreatedEvent } from "src/auth/core/events/userAccountCreated.event";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { SendLifecycleEmailPreviewUseCase } from "src/notifications/core/usecases/sendLifecycleEmailPreview.usecase";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { UserBuilder } from "src/users/core/model/user.mock";

describe("SendLifecycleEmailPreview integration test", () => {
  // A single app (and its SqlConnection pool) for the whole suite — the SqlConnectionModule's
  // Knex pool is a process-wide singleton; closing the app between tests would tear it down
  // for sibling tests.
  let fakeMailer: FakeMailer;
  let app: NestExpressApplication;
  let sqlConnection: Knex;
  let useCase: SendLifecycleEmailPreviewUseCase;
  let eventPublisher: DomainEventPublisher;

  before(async () => {
    fakeMailer = new FakeMailer();

    app = await createTestApp({
      providerOverrides: [{ token: SmtpMailer, useValue: fakeMailer }],
    });
    await app.init();

    sqlConnection = app.get(SqlConnection);
    useCase = app.get(SendLifecycleEmailPreviewUseCase);
    eventPublisher = app.get(RealEventPublisher);
  });

  beforeEach(() => {
    fakeMailer._reset();
  });

  after(async () => {
    await app.close();
  });

  it("writes no ledger row across several preview runs for a real user", async () => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail("u@example.com").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));

    await useCase.execute({ emailType: "welcome", recipients: ["u@example.com"] });
    await useCase.execute({ emailType: "welcome", recipients: ["u@example.com"] });
    await useCase.execute({ emailType: "welcome", recipients: ["u@example.com"] });

    assert.strictEqual(fakeMailer.sentEmails.length, 3);
    const deliveries = await sqlConnection("lifecycle_email_deliveries").select();
    assert.deepStrictEqual(deliveries, []);
  });

  it("does not block the genuine welcome send for the same user after a preview run", async () => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail("u@example.com").build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));

    await useCase.execute({ emailType: "welcome", recipients: ["u@example.com"] });

    await eventPublisher.publish(
      createUserAccountCreatedEvent("event-1", {
        userId,
        userEmail: "u@example.com",
        userFirstName: "Jane",
        userLastName: "Doe",
        subscribedToNewsletter: false,
      }),
    );

    const deliveries = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(deliveries.length, 1);
    assert.strictEqual(deliveries[0]?.status, "sent");
  });
});
