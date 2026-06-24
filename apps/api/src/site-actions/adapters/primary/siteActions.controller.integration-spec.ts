import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("SiteActions controller", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;
  const siteId = "f590f643-cd9a-4187-8973-f90e9f1998c8";

  before(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  after(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await sqlConnection("sites").insert({
      id: siteId,
      name: "Test Site",
      surface_area: 1000,
      owner_structure_type: "municipality",
      created_at: new Date(),
    });
  });

  describe("PATCH /sites/:siteId/actions/:actionId/status", () => {
    let actionId: string;

    beforeEach(async () => {
      actionId = uuid();
      // Create a test action
      await sqlConnection("site_actions").insert({
        id: actionId,
        site_id: siteId,
        action_type: "EVALUATE_COMPATIBILITY",
        status: "todo",
        created_at: new Date(),
      });
    });

    it("responds with a 401 when no authentication provided", async () => {
      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .send({ status: "done" });

      assert.strictEqual(response.status, 401);
    });

    it("responds with 400 when status is invalid", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "invalid-status" });

      assert.strictEqual(response.status, 400);
      assert.ok("errors" in (response.body as BadRequestResponseBody));
      const responseErrors = (response.body as BadRequestResponseBody).errors;
      assert.strictEqual(responseErrors.length, 1);
      assert.ok(responseErrors[0]?.path.includes("status"));
    });

    it("responds with 404 when action not found", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);
      const nonExistentActionId = uuid();

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${nonExistentActionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "done" });

      assert.strictEqual(response.status, 404);
      assert.ok("error" in (response.body as Record<string, unknown>));
      assert.strictEqual((response.body as Record<string, unknown>).error, "ACTION_NOT_FOUND");
    });

    it("updates action status to done and sets completedAt", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "done" });

      assert.strictEqual(response.status, 200);

      // Verify action was updated in database
      const updatedAction = await sqlConnection("site_actions").where({ id: actionId }).first();

      assert.ok(updatedAction !== undefined);
      assert.strictEqual(updatedAction.status, "done");
      assert.ok(updatedAction.completed_at !== undefined);
    });

    it("updates action status to skipped and sets completedAt", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "skipped" });

      assert.strictEqual(response.status, 200);

      // Verify action was updated in database
      const updatedAction = await sqlConnection("site_actions").where({ id: actionId }).first();

      assert.ok(updatedAction !== undefined);
      assert.strictEqual(updatedAction.status, "skipped");
      assert.ok(updatedAction.completed_at !== undefined);
    });
  });
});
