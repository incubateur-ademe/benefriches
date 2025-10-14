import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import supertest from "supertest";
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

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
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

      expect(response.status).toEqual(401);
    });

    it("can't start evaluation without mandatory field 'id'", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain("id");
    });

    it("starts a reconversion compatibility evaluation and saves it to database", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const evaluationId = uuid();

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: evaluationId });

      expect(response.status).toEqual(201);

      const evaluationsInDb = await sqlConnection("reconversion_compatibility_evaluations").select(
        "*",
      );

      expect(evaluationsInDb).toHaveLength(1);
      expect(evaluationsInDb[0]).toEqual({
        id: evaluationId,
        created_by: user.id,
        status: "started",
        mutafriches_evaluation_id: null,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        created_at: expect.any(Date),
        completed_at: null,
        project_creations: [],
      });
    });

    it("returns an error when trying to create an evaluation with an existing id", async () => {
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
      });

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/start-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: evaluationId });

      expect(response.status).toEqual(500);
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

      expect(response.status).toEqual(401);
    });

    it.each(["id", "mutafrichesId"] as const)(
      "can't complete evaluation without mandatory field '%s'",
      async (mandatoryField) => {
        const user = new UserBuilder().asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [mandatoryField]: _, ...body } = {
          id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          mutafrichesId: "mutafriches-123",
        };

        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-compatibility/complete-evaluation")
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(body);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

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

      expect(response.status).toEqual(201);

      const evaluationsInDb = await sqlConnection("reconversion_compatibility_evaluations")
        .select("*")
        .where({ id: evaluationId });

      expect(evaluationsInDb).toHaveLength(1);
      expect(evaluationsInDb[0]).toMatchObject({
        id: evaluationId,
        created_by: user.id,
        status: "completed",
        mutafriches_evaluation_id: "mutafriches-123",
        created_at: startedAt,
      });
      expect(evaluationsInDb[0]?.completed_at).toBeInstanceOf(Date);
    });

    it("returns an error when trying to complete a non-existent evaluation", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/complete-evaluation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ id: uuid(), mutafrichesId: "mutafriches-123" });

      expect(response.status).toEqual(500);
    });
  });

  describe("POST /reconversion-compatibility/add-project-creation", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/add-project-creation")
        .send({ evaluationId: uuid(), reconversionProjectId: uuid() });

      expect(response.status).toEqual(401);
    });

    it.each(["evaluationId", "reconversionProjectId"] as const)(
      "can't add project creation without mandatory field '%s'",
      async (mandatoryField) => {
        const user = new UserBuilder().asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [mandatoryField]: _, ...body } = {
          evaluationId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
          reconversionProjectId: "e717848d-1f24-4c71-b628-98aac33e3a00",
        };

        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-compatibility/add-project-creation")
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(body);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it("adds a project creation to a completed evaluation and updates it in database", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const evaluationId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
      const startedAt = new Date("2024-01-10T09:00:00Z");
      const completedAt = new Date("2024-01-10T10:00:00Z");

      await sqlConnection.raw(
        `INSERT INTO reconversion_compatibility_evaluations 
       (id, created_by, status, mutafriches_evaluation_id, created_at, completed_at, project_creations) 
       VALUES (?, ?, ?, ?, ?, ?, ?::jsonb)`,
        [evaluationId, user.id, "completed", "mutafriches-123", startedAt, completedAt, "[]"],
      );

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/add-project-creation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({
          evaluationId,
          reconversionProjectId: "fae39a8a-50de-4449-86f3-742a1584d9bd",
        });

      expect(response.status).toEqual(201);

      const evaluationsInDb = await sqlConnection("reconversion_compatibility_evaluations")
        .select("*")
        .where({ id: evaluationId });

      expect(evaluationsInDb).toHaveLength(1);
      expect(evaluationsInDb[0]).toEqual({
        id: evaluationId,
        created_by: user.id,
        status: "has_projects_created",
        mutafriches_evaluation_id: "mutafriches-123",
        created_at: startedAt,
        completed_at: completedAt,
        project_creations: [
          {
            reconversionProjectId: "fae39a8a-50de-4449-86f3-742a1584d9bd",
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            createdAt: expect.any(String), // stored as ISO string in JSONB
          },
        ],
      });
    });

    it("returns an error when trying to add project creation to a non-existent evaluation", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-compatibility/add-project-creation")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({
          evaluationId: uuid(),
          reconversionProjectId: uuid(),
        });

      expect(response.status).toEqual(500);
    });
  });
});
