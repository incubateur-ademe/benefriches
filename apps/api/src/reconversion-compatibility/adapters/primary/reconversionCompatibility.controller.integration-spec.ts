import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { assertShapeEquals, isDate } from "test/assertShapeEquals";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("ReconversionCompatibility controller", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;

  before(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  after(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("POST /reconversion-compatibility/start-evaluation", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .send({
          id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        });

      assert.strictEqual(response.status, 401);
    });

    it("can't start evaluation without mandatory field 'id'", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({});

      assert.strictEqual(response.status, 400);
      assert.ok("errors" in (response.body as BadRequestResponseBody));

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      assert.strictEqual(responseErrors.length, 1);
      assert.ok(responseErrors[0]?.path.includes("id"));
    });

    it("starts a reconversion compatibility evaluation and saves it to database", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const evaluationId = uuid();

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: evaluationId });

      assert.strictEqual(response.status, 201);

      const evaluationsInDb = await sqlConnection("reconversion_compatibility_evaluations").select(
        "*",
      );

      assert.strictEqual(evaluationsInDb.length, 1);
      assert.ok(evaluationsInDb[0]);
      assertShapeEquals(
        evaluationsInDb[0] as Record<string, unknown>,
        {
          id: evaluationId,
          created_by: user.id,
          status: "started",
          mutafriches_evaluation_id: null,
          completed_at: null,
          project_creations: null,
          related_site_id: null,
        },
        { created_at: isDate },
      );
    });

    it("returns a conflict error when trying to create an evaluation with an existing id", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const evaluationId = uuid();

      await sqlConnection("reconversion_compatibility_evaluations").insert({
        id: evaluationId,
        created_by: user.id,
        status: "started",
        created_at: new Date(),
        project_creations: [],
        completed_at: null,
        mutafriches_evaluation_id: null,
        related_site_id: null,
      });

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: evaluationId });

      assert.strictEqual(response.status, 409);
    });
  });

  describe("POST /reconversion-compatibility/complete-evaluation", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/complete-evaluation")
        .send({
          evaluationId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          mutafrichesEvaluationId: "mutafriches-123",
        });

      assert.strictEqual(response.status, 401);
    });

    for (const mandatoryField of ["id", "mutafrichesId"] as const) {
      it(`can't complete evaluation without mandatory field '${mandatoryField}'`, async () => {
        const user = new UserBuilder().asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        // oxlint-disable-next-line typescript/no-unused-vars
        const { [mandatoryField]: _, ...body } = {
          id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          mutafrichesId: "mutafriches-123",
        };

        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-compatibility/complete-evaluation")
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(body);

        assert.strictEqual(response.status, 400);
        assert.ok("errors" in (response.body as BadRequestResponseBody));

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        assert.strictEqual(responseErrors.length, 1);
        assert.ok(responseErrors[0]?.path.includes(mandatoryField));
      });
    }

    it("completes a started evaluation and updates it in db", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const evaluationId = uuid();
      const startedAt = new Date("2024-01-10T09:00:00Z");

      // we use raw SQL here because knex does not handle arrays in jsonb well
      await sqlConnection.raw(
        `INSERT INTO reconversion_compatibility_evaluations
   (id, created_by, status, mutafriches_evaluation_id, created_at, completed_at, project_creations)
   VALUES (?, ?, ?, ?, ?, ?, ?::jsonb)`,
        [evaluationId, user.id, "started", null, startedAt, null, JSON.stringify([])],
      );

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/complete-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: evaluationId, mutafrichesId: "mutafriches-123" });

      assert.strictEqual(response.status, 201);

      const evaluationsInDb = await sqlConnection("reconversion_compatibility_evaluations")
        .select("*")
        .where({ id: evaluationId });

      assert.strictEqual(evaluationsInDb.length, 1);
      assert.ok(evaluationsInDb[0]);
      // assert the deterministic fields
      assert.strictEqual(evaluationsInDb[0].id, evaluationId);
      assert.strictEqual(evaluationsInDb[0].created_by, user.id);
      assert.strictEqual(evaluationsInDb[0].status, "completed");
      assert.strictEqual(evaluationsInDb[0].mutafriches_evaluation_id, "mutafriches-123");
      assert.deepStrictEqual(evaluationsInDb[0].created_at, startedAt);
      // completed_at is non-deterministic but must be a Date
      assert.ok(evaluationsInDb[0].completed_at instanceof Date);
    });

    it("returns an error when trying to complete a non-existent evaluation", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/complete-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: uuid(), mutafrichesId: "mutafriches-123" });

      assert.strictEqual(response.status, 500);
    });
  });

  describe("POST /reconversion-compatibility/:evaluationId/add-related-site", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-compatibility/${uuid()}/add-related-site`)
        .send({ relatedSiteId: uuid() });

      assert.strictEqual(response.status, 401);
    });

    it("can't add related site id without required parameter", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post(
          `/api/reconversion-compatibility/f47ac10b-58cc-4372-a567-0e02b2c3d479/add-related-site`,
        )
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({});

      assert.strictEqual(response.status, 400);
      assert.ok("errors" in (response.body as BadRequestResponseBody));

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      assert.strictEqual(responseErrors.length, 1);
      assert.ok(responseErrors[0]?.path.includes("relatedSiteId"));
    });

    it("adds a relatedSiteId to a completed evaluation and updates it in database", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const evaluationId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const startedAt = new Date("2024-01-10T09:00:00Z");
      const completedAt = new Date("2024-01-10T10:00:00Z");

      await sqlConnection.raw(
        `INSERT INTO sites
       (id, name, created_by, creation_mode, nature, surface_area, owner_structure_type, tenant_structure_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          "fae39a8a-50de-4449-86f3-742a1584d9bd",
          "Mon site",
          user.id,
          "custom",
          "friche",
          15000,
          "",
          "",
          startedAt,
        ],
      );

      await sqlConnection.raw(
        `INSERT INTO reconversion_compatibility_evaluations
       (id, created_by, status, mutafriches_evaluation_id, created_at, completed_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
        [evaluationId, user.id, "completed", "mutafriches-123", startedAt, completedAt],
      );

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-compatibility/${evaluationId}/add-related-site`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({
          relatedSiteId: "fae39a8a-50de-4449-86f3-742a1584d9bd",
        });

      assert.strictEqual(response.status, 201);

      const evaluationsInDb = await sqlConnection("reconversion_compatibility_evaluations")
        .select("*")
        .where({ id: evaluationId });

      assert.strictEqual(evaluationsInDb.length, 1);
      assert.deepStrictEqual(evaluationsInDb[0], {
        id: evaluationId,
        created_by: user.id,
        status: "related_site_created",
        mutafriches_evaluation_id: "mutafriches-123",
        created_at: startedAt,
        completed_at: completedAt,
        related_site_id: "fae39a8a-50de-4449-86f3-742a1584d9bd",
        project_creations: null,
      });
    });

    it("returns an error when trying to add related site id to an evaluation that already have related_site_id", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);
      const startedAt = new Date("2024-01-10T09:00:00Z");
      const completedAt = new Date("2024-01-10T10:00:00Z");

      const siteId = uuid();
      await sqlConnection.raw(
        `INSERT INTO sites
       (id, name, created_by, creation_mode, nature, surface_area, owner_structure_type, tenant_structure_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [siteId, "Mon site", user.id, "custom", "friche", 15000, "", "", startedAt],
      );
      await sqlConnection.raw(
        `INSERT INTO reconversion_compatibility_evaluations
       (id, created_by, status, mutafriches_evaluation_id, created_at, completed_at, related_site_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [uuid(), user.id, "completed", "mutafriches-123", startedAt, completedAt, siteId],
      );

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-compatibility/${uuid()}/add-related-site`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({
          relatedSiteId: uuid(),
        });

      assert.strictEqual(response.status, 500);
    });

    it("returns an error when trying to add related site id to a non-existent evaluation", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-compatibility/${uuid()}/add-related-site`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({
          relatedSiteId: uuid(),
        });

      assert.strictEqual(response.status, 500);
    });
  });
});
