import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import supertest from "supertest";
import { authenticateUser, createTestApp, saveUser } from "test/testApp";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("Users controller", () => {
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

  describe("POST /users/feature-alert", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/users/feature-alert")
        .send({
          id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
          userId: "cc5fefe9-3bcb-4271-a27b-50ab9bb33596",
          email: "user@ademe.fr",
          feature: {
            type: "duplicate_project",
          },
        });

      expect(response.status).toEqual(401);
    });

    it.each(["id", "email", "feature"] as const)(
      "can't create a feature alert without mandatory field %s",
      async (mandatoryField) => {
        const user = new UserBuilder().asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        // oxlint-disable-next-line typescript/no-unused-vars
        const { [mandatoryField]: _, ...props } = {
          id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
          userId: "cc5fefe9-3bcb-4271-a27b-50ab9bb33596",
          email: "user@ademe.fr",
          feature: {
            type: "duplicate_project",
          },
        };
        const response = await supertest(app.getHttpServer())
          .post("/api/users/feature-alert")
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(props);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it.each([
      { type: "export_impacts", options: ["pdf", "excel", "sharing_link"] },
      { type: "update_project" },
      { type: "update_site" },
      { type: "duplicate_project" },
      { type: "mutafriches_availability" },
      { type: "compare_impacts", options: ["same_project_on_prairie"] },
    ])("get a 201 response and user is created $type", async ({ type, options }) => {
      const user = new UserBuilder().asLocalAuthority().build();
      await saveUser(app)(user);
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/users/feature-alert")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({
          id: "2096a04d-4876-4e1e-b071-d5355fd0ee4c",
          userId: user.id,
          email: user.email,
          feature: {
            type,
            options,
          },
        });

      expect(response.status).toEqual(201);

      const result = await sqlConnection("users_feature_alerts").select(
        "id",
        "email",
        "feature_type",
        "feature_options",
      );
      expect(result.length).toEqual(1);
      expect(result[0]?.id).toEqual("2096a04d-4876-4e1e-b071-d5355fd0ee4c");
      expect(result[0]?.email).toEqual(user.email);
      expect(result[0]?.feature_type).toEqual(type);
      expect(result[0]?.feature_options === null).toBe(
        type === "duplicate_project" ||
          type === "mutafriches_availability" ||
          type === "update_site" ||
          type === "update_project",
      );
    });
  });
});
