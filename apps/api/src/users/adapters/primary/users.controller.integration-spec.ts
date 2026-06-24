import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
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

  before(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  after(async () => {
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

      assert.strictEqual(response.status, 401);
    });

    for (const mandatoryField of ["id", "email", "feature"] as const) {
      it(`can't create a feature alert without mandatory field ${mandatoryField}`, async () => {
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

        assert.strictEqual(response.status, 400);
        assert.ok("errors" in (response.body as BadRequestResponseBody));

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        assert.strictEqual(responseErrors.length, 1);
        assert.ok(responseErrors[0]?.path.includes(mandatoryField));
      });
    }

    for (const { type, options } of [
      { type: "export_impacts", options: ["pdf", "excel", "sharing_link"] },
      { type: "update_project", options: undefined },
      { type: "update_site", options: undefined },
      { type: "duplicate_project", options: undefined },
      { type: "mutafriches_availability", options: undefined },
      { type: "compare_impacts", options: ["same_project_on_prairie"] },
    ] as const) {
      it(`get a 201 response and user is created ${type}`, async () => {
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

        assert.strictEqual(response.status, 201);

        const result = await sqlConnection("users_feature_alerts").select(
          "id",
          "email",
          "feature_type",
          "feature_options",
        );
        assert.strictEqual(result.length, 1);
        assert.strictEqual(result[0]?.id, "2096a04d-4876-4e1e-b071-d5355fd0ee4c");
        assert.strictEqual(result[0]?.email, user.email);
        assert.strictEqual(result[0]?.feature_type, type);
        assert.strictEqual(
          result[0]?.feature_options === null,
          type === "duplicate_project" ||
            type === "mutafriches_availability" ||
            type === "update_site" ||
            type === "update_project",
        );
      });
    }
  });
});
