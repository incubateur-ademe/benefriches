/* oxlint-disable typescript/no-non-null-assertion */
import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import type { GetSiteActionsResponseDto } from "shared";
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

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
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

  describe("GET /sites/:siteId/actions", () => {
    it("responds with a 401 when no authentication provided", async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/sites/${siteId}/actions`);

      expect(response.status).toEqual(401);
    });

    it("returns empty array when site has no actions", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/actions`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual<GetSiteActionsResponseDto>([]);
    });

    it("returns all actions for a site when they exist", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const action1Id = uuid();
      const action2Id = uuid();
      const now = new Date();

      // Insert test actions
      await sqlConnection("site_actions").insert([
        {
          id: action1Id,
          site_id: siteId,
          action_type: "EVALUATE_COMPATIBILITY",
          status: "todo",
          created_at: now,
        },
        {
          id: action2Id,
          site_id: siteId,
          action_type: "REQUEST_FUNDING_INFORMATION",
          status: "done",
          created_at: new Date(now.getTime() + 1000),
          completed_at: new Date(now.getTime() + 2000),
        },
      ]);

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/actions`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual<GetSiteActionsResponseDto>([
        {
          id: action1Id,
          siteId,
          actionType: "EVALUATE_COMPATIBILITY",
          status: "todo",
        },
        {
          id: action2Id,
          siteId,
          actionType: "REQUEST_FUNDING_INFORMATION",
          status: "done",
        },
      ]);
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

      expect(response.status).toEqual(401);
    });

    it("responds with 400 when status is invalid", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "invalid-status" });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");
      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain("status");
    });

    it("responds with 404 when action not found", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);
      const nonExistentActionId = uuid();

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${nonExistentActionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "done" });

      expect(response.status).toEqual(404);
      expect(response.body).toHaveProperty("error", "ACTION_NOT_FOUND");
    });

    it("updates action status to done and sets completedAt", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "done" });

      expect(response.status).toEqual(200);

      // Verify action was updated in database
      const updatedAction = await sqlConnection("site_actions").where({ id: actionId }).first();

      expect(updatedAction).toBeDefined();
      expect(updatedAction!.status).toEqual("done");
      expect(updatedAction!.completed_at).toBeDefined();
    });

    it("updates action status to skipped and sets completedAt", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .patch(`/api/sites/${siteId}/actions/${actionId}/status`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ status: "skipped" });

      expect(response.status).toEqual(200);

      // Verify action was updated in database
      const updatedAction = await sqlConnection("site_actions").where({ id: actionId }).first();

      expect(updatedAction).toBeDefined();
      expect(updatedAction!.status).toEqual("skipped");
      expect(updatedAction!.completed_at).toBeDefined();
    });
  });
});
