import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { subHours } from "date-fns";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import type { SiteCreationMode, SiteNature } from "shared";
import { assertShapeEquals } from "test/assertShapeEquals";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import {
  SendFirstProjectRemindersUseCase,
  type SendFirstProjectRemindersSummary,
} from "src/notifications/core/usecases/sendFirstProjectReminders.usecase";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { SuccessResult } from "src/shared-kernel/result";
import { UserBuilder } from "src/users/core/model/user.mock";

const fakeNow = new Date("2026-01-15T08:00:00.000Z");
const NBSP = " ";
const subjectFor = (siteName: string) =>
  `${siteName}${NBSP}: et si vous renseigniez votre projet d’aménagement${NBSP}?`;

describe("SendFirstProjectReminders integration test", () => {
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
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      created_at: subHours(fakeNow, 200),
    });
    return userId;
  };

  const insertSite = async (options: {
    createdBy: string;
    name: string;
    nature: SiteNature;
    creationMode: SiteCreationMode;
    createdAt: Date;
  }) => {
    const siteId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: options.createdBy,
      name: options.name,
      nature: options.nature,
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: options.creationMode,
      status: "active",
      created_at: options.createdAt,
    });
    return siteId;
  };

  const getSummary = (result: Awaited<ReturnType<SendFirstProjectRemindersUseCase["execute"]>>) =>
    (result as SuccessResult<SendFirstProjectRemindersSummary>).getData();

  it("sends a reminder named after a friche created 36 hours ago with no project", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");
    const siteId = await insertSite({
      createdBy: userId,
      name: "Ancienne carrière d’argile de Blajan",
      nature: "FRICHE",
      creationMode: "custom",
      createdAt: subHours(fakeNow, 36),
    });

    await app.get(SendFirstProjectRemindersUseCase).execute({ dryRun: false });

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    const email = fakeMailer.sentEmails[0];
    assert.strictEqual(email?.to, "gregoire.bailleux@example.fr");
    assert.strictEqual(email.subject, subjectFor("Ancienne carrière d’argile de Blajan"));
    const webappUrl = app.get(ConfigService).getOrThrow<string>("WEBAPP_URL");
    assert.ok(email.html.includes(`href="${webappUrl}/creer-projet?siteId=${siteId}"`));
    const rows = await sqlConnection("lifecycle_email_deliveries").where("user_id", userId);
    assert.strictEqual(rows.length, 1);
    const [row] = rows;
    assert.ok(row);
    assertShapeEquals(
      row,
      {
        user_id: userId,
        email_type: "first-project-reminder",
        related_entity_id: siteId,
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

  it("sends a reminder worded for a site for an agricultural site", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");
    await insertSite({
      createdBy: userId,
      name: "Exploitation des Quatre Chemins",
      nature: "AGRICULTURAL_OPERATION",
      creationMode: "express",
      createdAt: subHours(fakeNow, 36),
    });

    await app.get(SendFirstProjectRemindersUseCase).execute({ dryRun: false });

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    assert.ok(
      fakeMailer.sentEmails[0]?.text.includes("Hier vous avez renseigné un site sur Bénéfriches."),
    );
  });

  it("sends nothing to someone who imported forty sites from a CSV file", async () => {
    const userId = await insertUser("importer@example.fr");
    for (let index = 1; index <= 40; index++) {
      await insertSite({
        createdBy: userId,
        name: `Site importé ${index}`,
        nature: "FRICHE",
        creationMode: "csv-import",
        createdAt: subHours(fakeNow, 36),
      });
    }

    const result = await app.get(SendFirstProjectRemindersUseCase).execute({ dryRun: false });

    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await sqlConnection("lifecycle_email_deliveries"), []);
    assert.strictEqual(getSummary(result).eligible, 0);
  });

  it("sends two emails to someone with two eligible sites, each naming one site", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");
    const site40hId = await insertSite({
      createdBy: userId,
      name: "Friche de Blajan",
      nature: "FRICHE",
      creationMode: "custom",
      createdAt: subHours(fakeNow, 40),
    });
    const site36hId = await insertSite({
      createdBy: userId,
      name: "Exploitation des Quatre Chemins",
      nature: "AGRICULTURAL_OPERATION",
      creationMode: "custom",
      createdAt: subHours(fakeNow, 36),
    });

    await app.get(SendFirstProjectRemindersUseCase).execute({ dryRun: false });

    assert.deepStrictEqual(
      fakeMailer.sentEmails.map((email) => email.subject),
      [subjectFor("Friche de Blajan"), subjectFor("Exploitation des Quatre Chemins")],
    );
    const rows = await sqlConnection("lifecycle_email_deliveries")
      .where("user_id", userId)
      .orderBy("related_entity_id");
    assert.deepStrictEqual(
      rows.map((row) => row.related_entity_id),
      [site40hId, site36hId].toSorted(),
    );
  });

  it("running the job twice the same day sends one reminder per site", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");
    await insertSite({
      createdBy: userId,
      name: "Ancienne carrière d’argile de Blajan",
      nature: "FRICHE",
      creationMode: "custom",
      createdAt: subHours(fakeNow, 36),
    });
    const useCase = app.get(SendFirstProjectRemindersUseCase);

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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("dry run sends nothing and writes no ledger row", async () => {
    const userId = await insertUser("gregoire.bailleux@example.fr");
    await insertSite({
      createdBy: userId,
      name: "Ancienne carrière d’argile de Blajan",
      nature: "FRICHE",
      creationMode: "custom",
      createdAt: subHours(fakeNow, 36),
    });

    const result = await app.get(SendFirstProjectRemindersUseCase).execute({ dryRun: true });

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
    } satisfies SendFirstProjectRemindersSummary);
  });
});
