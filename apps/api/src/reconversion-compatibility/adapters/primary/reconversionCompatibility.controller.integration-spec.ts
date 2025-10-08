import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";

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

      const evaluationId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";

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

      const evaluationId = "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d";

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
});
