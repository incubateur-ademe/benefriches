import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { subHours } from "date-fns";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { assertShapeEquals } from "test/assertShapeEquals";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import {
  SendFirstSiteRemindersUseCase,
  type SendFirstSiteRemindersSummary,
} from "src/notifications/core/usecases/sendFirstSiteReminders.usecase";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SuccessResult } from "src/shared-kernel/result";
import { UserBuilder } from "src/users/core/model/user.mock";

const fakeNow = new Date("2026-01-15T08:00:00.000Z");
const registeredAt = subHours(fakeNow, 36);

describe("SendFirstSiteReminders integration test", () => {
  // One app for the whole suite: test apps share the SqlConnectionModule's Knex pool.
  // .env.test has the kill switch on and the fake contact (Mathilde Lefèvre).
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

  const insertUser = async (email: string) => {
    const userId = uuid();
    const user = new UserBuilder()
      .withId(userId)
      .withEmail(email)
      .withFirstName("Grégoire")
      .withLastName("Bailleux")
      .build();
    await sqlConnection("users").insert({ ...mapUserToSqlRow(user), created_at: registeredAt });
    return userId;
  };

  const getSummary = (result: Awaited<ReturnType<SendFirstSiteRemindersUseCase["execute"]>>) =>
    (result as SuccessResult<SendFirstSiteRemindersSummary>).getData();

  it("sends the reminder to a user registered 36 hours ago who has no site", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");

    await app.get(SendFirstSiteRemindersUseCase).execute({ dryRun: false });

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    const email = fakeMailer.sentEmails[0];
    assert.strictEqual(email?.to, "gregoire.bailleux@example.fr");
    assert.strictEqual(email.subject, "Renseignez votre premier site sur Bénéfriches !");
    assert.ok(email.text.startsWith("Bonjour Grégoire Bailleux,\n\n"));
    assert.ok(email.html.includes('href="mailto:mathilde.lefevre@example.com"'));
    assert.ok(
      email.text.includes(
        buildUnsubscribeUrl(
          app.get(ConfigService).getOrThrow<string>("WEBAPP_URL"),
          app.get(HmacUnsubscribeTokenService).sign(userId),
        ),
      ),
    );
    const rows = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(rows.length, 1);
    const [row] = rows;
    assert.ok(row);
    assertShapeEquals(
      row,
      {
        user_id: userId,
        email_type: "first-site-reminder",
        related_entity_id: null,
        status: "sent",
        created_at: fakeNow,
        sent_at: fakeNow,
        error_message: null,
        attempts: 1,
        last_attempted_at: fakeNow,
      },
      { id: (value) => typeof value === "string" },
    );
  });

  it("sends nothing to a user registered 36 hours ago who imported sites from a CSV file", async () => {
    const userId = await insertUser("importer@example.fr");
    await sqlConnection("sites").insert({
      id: uuid(),
      created_by: userId,
      name: "Site importé",
      nature: "FRICHE",
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: "csv-import",
      status: "active",
      created_at: subHours(fakeNow, 30),
    });

    const result = await app.get(SendFirstSiteRemindersUseCase).execute({ dryRun: false });

    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await sqlConnection("lifecycle_email_deliveries"), []);
    assert.strictEqual(getSummary(result).eligible, 0);
  });

  it("running the job twice the same day sends one reminder", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");
    const useCase = app.get(SendFirstSiteRemindersUseCase);

    await useCase.execute({ dryRun: false });
    const secondResult = await useCase.execute({ dryRun: false });

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    assert.strictEqual(
      (await sqlConnection("lifecycle_email_deliveries").where("user_id", userId)).length,
      1,
    );
    assert.deepStrictEqual(getSummary(secondResult), {
      eligible: 0,
      sent: 0,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("dry run sends nothing and writes no ledger row", async () => {
    await insertUser("gregoire.bailleux@example.fr");

    const result = await app.get(SendFirstSiteRemindersUseCase).execute({ dryRun: true });

    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await sqlConnection("lifecycle_email_deliveries"), []);
    assert.deepStrictEqual(getSummary(result), {
      eligible: 1,
      sent: 0,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: true,
    } satisfies SendFirstSiteRemindersSummary);
  });
});
