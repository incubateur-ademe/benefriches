import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it, mock } from "node:test";
import supertest from "supertest";
import { assertShapeEquals } from "test/assertShapeEquals";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { SendProjectImpactsSummaryEmailUseCase } from "src/notifications/core/usecases/sendProjectImpactsSummaryEmail.usecase";
import { createReconversionProjectCreatedEvent } from "src/reconversion-projects/core/events/reconversionProjectCreated.event";
import { buildUrbanProjectReconversionProjectProps } from "src/reconversion-projects/core/model/reconversionProject.mock";
import { GetProjectImpactAnalysisUseCase } from "src/reconversion-projects/core/usecases/getProjectImpactsAnalysisUseCase.usecase";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

const fakeNow = new Date("2026-06-15T10:00:00.000Z");
const NBSP = " ";
const expectedSubject = `Projet sur Friche de la Sucrerie${NBSP}: résultats de votre évaluation`;

describe("SendProjectImpactsSummaryOnReconversionProjectCreatedHandler integration test", () => {
  // A single app (and its SqlConnection pool) for the whole suite, as in the welcome handler's
  // spec: closing an app after every test would tear down the shared Knex pool.
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

  // The author and a friche in Mont-de-Marsan, with enough data for the impacts computation.
  const seedAuthorAndSite = async ({ userId, email }: { userId: string; email: string }) => {
    const siteId = uuid();
    const user = new UserBuilder().withId(userId).withEmail(email).asLocalAuthority().build();
    await sqlConnection("users").insert(mapUserToSqlRow(user));
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: userId,
      name: "Friche de la Sucrerie",
      nature: "FRICHE",
      friche_activity: "INDUSTRY",
      surface_area: 14000,
      owner_structure_type: "municipality",
      owner_name: "Mairie de Mont-de-Marsan",
      creation_mode: "custom",
      created_at: new Date("2026-06-01T10:00:00.000Z"),
    });
    await sqlConnection("addresses").insert({
      id: uuid(),
      ban_id: "40192",
      value: "Mont-de-Marsan",
      city: "Mont-de-Marsan",
      city_code: "40192",
      post_code: "40000",
      lat: 43.891274,
      long: -0.50031,
      site_id: siteId,
    });
    await sqlConnection("site_soils_distributions").insert({
      id: uuid(),
      site_id: siteId,
      soil_type: "BUILDINGS",
      surface_area: 14000,
    });
    const { accessToken } = await authenticateUser(app)(user);
    return { siteId, accessToken };
  };

  const createCustomProject = (
    accessToken: string,
    { projectId, siteId }: { projectId: string; siteId: string },
  ) => {
    const { createdBy: _, ...projectProps } = buildUrbanProjectReconversionProjectProps();
    return supertest(app.getHttpServer())
      .post("/api/reconversion-projects")
      .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
      .send({
        ...projectProps,
        id: projectId,
        relatedSiteId: siteId,
        name: "Habitation, école et commerce",
      });
  };

  const summaryRows = (userId: string) =>
    sqlConnection("lifecycle_email_deliveries")
      .where({ user_id: userId, email_type: "project-impacts-summary" })
      .select();

  it("emails the summary to the author of a project created with the wizard", async () => {
    const userId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });

    const response = await createCustomProject(accessToken, { projectId, siteId });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(
      fakeMailer.sentEmails.map(({ to, subject }) => ({ to, subject })),
      [{ to: "gregoire.bailleux@example.fr", subject: expectedSubject }],
    );
    assert.deepStrictEqual(fakeMailer.sentEmails[0]?.text.split("\n\n").slice(0, 2), [
      "Voici les résultats de l'évaluation socio-économique du projet « Habitation, école et commerce » sur le site « Friche de la Sucrerie ».",
      "Évaluation réalisée le 15 juin 2026",
    ]);
    const rows = await summaryRows(userId);
    assert.strictEqual(rows.length, 1);
    const [row] = rows;
    assert.ok(row);
    assertShapeEquals(
      row,
      {
        user_id: userId,
        email_type: "project-impacts-summary",
        related_entity_id: projectId,
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

  it("emails the summary to the author of a project created from a template", async () => {
    const userId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });

    const response = await supertest(app.getHttpServer())
      .post("/api/reconversion-projects/create-from-template")
      .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
      .send({
        reconversionProjectId: projectId,
        siteId,
        template: "PUBLIC_FACILITIES",
      });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(
      fakeMailer.sentEmails.map(({ to, subject }) => ({ to, subject })),
      [{ to: "gregoire.bailleux@example.fr", subject: expectedSubject }],
    );
    assert.deepStrictEqual(
      (await summaryRows(userId)).map(({ related_entity_id, status }) => ({
        related_entity_id,
        status,
      })),
      [{ related_entity_id: projectId, status: "sent" }],
    );
  });

  it("emails the summary to the authenticated author only, when a wizard project body names another user", async () => {
    const authorId = uuid();
    const otherUserId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId: authorId,
      email: "gregoire.bailleux@example.fr",
    });
    await seedAuthorAndSite({ userId: otherUserId, email: "other.user@example.fr" });
    const { createdBy: _, ...projectProps } = buildUrbanProjectReconversionProjectProps();

    const response = await supertest(app.getHttpServer())
      .post("/api/reconversion-projects")
      .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
      .send({
        ...projectProps,
        id: projectId,
        createdBy: otherUserId,
        relatedSiteId: siteId,
        name: "Habitation, école et commerce",
      });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(
      fakeMailer.sentEmails.map(({ to }) => to),
      ["gregoire.bailleux@example.fr"],
    );
    assert.deepStrictEqual(await summaryRows(otherUserId), []);
  });

  it("emails the summary to the authenticated author only, when a template project body names another user", async () => {
    const authorId = uuid();
    const otherUserId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId: authorId,
      email: "gregoire.bailleux@example.fr",
    });
    await seedAuthorAndSite({ userId: otherUserId, email: "other.user@example.fr" });

    const response = await supertest(app.getHttpServer())
      .post("/api/reconversion-projects/create-from-template")
      .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
      .send({
        reconversionProjectId: projectId,
        createdBy: otherUserId,
        siteId,
        template: "PUBLIC_FACILITIES",
      });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(
      fakeMailer.sentEmails.map(({ to }) => to),
      ["gregoire.bailleux@example.fr"],
    );
    assert.deepStrictEqual(await summaryRows(otherUserId), []);
  });

  it("sends no summary for a duplicated project", async () => {
    const userId = uuid();
    const projectId = uuid();
    const newProjectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });
    await createCustomProject(accessToken, { projectId, siteId });
    fakeMailer._reset();

    const response = await supertest(app.getHttpServer())
      .post(`/api/reconversion-projects/${projectId}/duplicate`)
      .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
      .send({ newProjectId });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(
      await sqlConnection("lifecycle_email_deliveries").where("related_entity_id", newProjectId),
      [],
    );
  });

  it("does not fail project creation when the impacts computation throws", async () => {
    const userId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });
    mock.method(app.get(GetProjectImpactAnalysisUseCase), "execute", () =>
      Promise.reject(new Error("Impacts computation crashed")),
    );

    const response = await createCustomProject(accessToken, { projectId, siteId });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(
      await sqlConnection("reconversion_projects").where("id", projectId).select("id"),
      [{ id: projectId }],
    );
    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(
      (await summaryRows(userId)).map(({ related_entity_id, status, error_message }) => ({
        related_entity_id,
        status,
        error_message,
      })),
      [
        {
          related_entity_id: projectId,
          status: "failed",
          error_message: "Impacts computation crashed",
        },
      ],
    );
  });

  it("does not fail project creation when the summary email use case throws", async () => {
    const userId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });
    mock.method(app.get(SendProjectImpactsSummaryEmailUseCase), "execute", () =>
      Promise.reject(new Error("Ledger unavailable")),
    );

    const response = await createCustomProject(accessToken, { projectId, siteId });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(
      await sqlConnection("reconversion_projects").where("id", projectId).select("id"),
      [{ id: projectId }],
    );
    assert.deepStrictEqual(fakeMailer.sentEmails, []);
  });

  it("does not send a second summary when the project-created event is published again", async () => {
    const userId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });
    await createCustomProject(accessToken, { projectId, siteId });

    await app.get(RealEventPublisher).publish(
      createReconversionProjectCreatedEvent(uuid(), {
        reconversionProjectId: projectId,
        siteId,
        createdBy: userId,
      }),
    );

    assert.strictEqual(fakeMailer.sentEmails.length, 1);
    assert.strictEqual((await summaryRows(userId)).length, 1);
  });

  it("sends nothing to an author who unsubscribed", async () => {
    const userId = uuid();
    const projectId = uuid();
    const { siteId, accessToken } = await seedAuthorAndSite({
      userId,
      email: "gregoire.bailleux@example.fr",
    });
    await sqlConnection("users")
      .where("id", userId)
      .update({ lifecycle_emails_unsubscribed_at: new Date("2026-06-01T00:00:00.000Z") });

    const response = await createCustomProject(accessToken, { projectId, siteId });

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(fakeMailer.sentEmails, []);
    assert.deepStrictEqual(await summaryRows(userId), []);
  });
});
