import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import type {
  GetAdminDashboardStatsResponseDto,
  GetAdminUserResponseDto,
  ListAdminUsersResponseDto,
} from "shared";
import supertest from "supertest";
import { authenticateUser, createTestApp, saveUser } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import type { User } from "src/auth/core/user";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

describe("Admin controller", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;

  const authenticateAdmin = async (): Promise<{ admin: User; accessToken: string }> => {
    const admin = new UserBuilder().withEmail("admin@benefriches.fr").build();
    await saveUser(app)(admin);
    await sqlConnection("administrators").insert({
      user_id: admin.id,
      created_at: new Date("2026-01-01T00:00:00.000Z"),
    });
    const { accessToken } = await authenticateUser(app)(admin);
    return { admin, accessToken };
  };

  before(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  after(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("GET /admin/stats", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/admin/stats");

      assert.strictEqual(response.status, 401);
    });

    it("responds with 403 if authenticated user is not an administrator", async () => {
      const user = new UserBuilder().build();
      await saveUser(app)(user);
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get("/api/admin/stats")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 403);
    });

    it("responds with 200 and dashboard stats for an administrator", async () => {
      const { accessToken } = await authenticateAdmin();

      const response = await supertest(app.getHttpServer())
        .get("/api/admin/stats")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 200);
      const body = response.body as GetAdminDashboardStatsResponseDto;
      assert.deepStrictEqual(body.totals, {
        users: 1,
        sites: 0,
        projects: 0,
        compatibilityEvaluations: 0,
      });
      assert.strictEqual(body.monthly.length, 12);
      assert.deepStrictEqual(body.currentMonth, body.monthly[11]);
      assert.strictEqual(body.currentMonth.usersCreated, 1);
    });
  });

  describe("GET /admin/users", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/admin/users");

      assert.strictEqual(response.status, 401);
    });

    it("responds with 403 if authenticated user is not an administrator", async () => {
      const user = new UserBuilder().build();
      await saveUser(app)(user);
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get("/api/admin/users")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 403);
    });

    it("responds with 400 when page is not a positive integer", async () => {
      const { accessToken } = await authenticateAdmin();

      const response = await supertest(app.getHttpServer())
        .get("/api/admin/users?page=0")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 400);
    });

    it("responds with 200 and paginated users list for an administrator", async () => {
      const { admin, accessToken } = await authenticateAdmin();
      const userId = uuid();
      await sqlConnection("users").insert({
        id: userId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
        structure_type: "municipality",
        structure_activity: "local_authority",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
        personal_data_storage_consented_at: new Date("2026-01-01T08:00:00.000Z"),
      });

      const response = await supertest(app.getHttpServer())
        .get("/api/admin/users")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 200);
      const body = response.body as ListAdminUsersResponseDto;
      assert.strictEqual(body.total, 2);
      assert.strictEqual(body.page, 1);
      assert.strictEqual(body.pageSize, 25);
      assert.strictEqual(body.users.length, 2);
      // admin was saved with "now" as creation date, so it comes first
      assert.strictEqual(body.users[0]?.id, admin.id);
      assert.deepStrictEqual(body.users[1], {
        id: userId,
        email: "jane@collectivite.fr",
        firstName: "Jane",
        lastName: "Doe",
        structureName: "Mairie de Blajan",
        structureType: "municipality",
        structureActivity: "local_authority",
        createdAt: "2026-01-01T08:00:00.000Z",
        lastLoginAt: null,
      });
    });

    it("filters users with search query", async () => {
      const { accessToken } = await authenticateAdmin();
      const userId = uuid();
      await sqlConnection("users").insert({
        id: userId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
        structure_type: "municipality",
        structure_activity: "local_authority",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
        personal_data_storage_consented_at: new Date("2026-01-01T08:00:00.000Z"),
      });

      const response = await supertest(app.getHttpServer())
        .get("/api/admin/users?search=blajan")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 200);
      const body = response.body as ListAdminUsersResponseDto;
      assert.strictEqual(body.total, 1);
      assert.deepStrictEqual(
        body.users.map((user) => user.id),
        [userId],
      );
    });
  });

  describe("GET /admin/users/:userId", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/admin/users/${uuid()}`);

      assert.strictEqual(response.status, 401);
    });

    it("responds with 403 if authenticated user is not an administrator", async () => {
      const user = new UserBuilder().build();
      await saveUser(app)(user);
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get(`/api/admin/users/${user.id}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 403);
    });

    it("responds with 404 when user does not exist", async () => {
      const { accessToken } = await authenticateAdmin();

      const response = await supertest(app.getHttpServer())
        .get(`/api/admin/users/${uuid()}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 404);
    });

    it("responds with 200 and user activity for an administrator", async () => {
      const { accessToken } = await authenticateAdmin();
      const userId = uuid();
      await sqlConnection("users").insert({
        id: userId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
        structure_type: "municipality",
        structure_activity: "local_authority",
        subscribed_to_newsletter: true,
        created_at: new Date("2026-01-01T08:00:00.000Z"),
        personal_data_storage_consented_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: userId,
        name: "Friche industrielle",
        nature: "FRICHE",
        surface_area: 1000,
        owner_structure_type: "company",
        creation_mode: "custom",
        created_at: new Date("2026-01-03T10:00:00.000Z"),
      });

      const response = await supertest(app.getHttpServer())
        .get(`/api/admin/users/${userId}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body as GetAdminUserResponseDto, {
        user: {
          id: userId,
          email: "jane@collectivite.fr",
          firstName: "Jane",
          lastName: "Doe",
          structureName: "Mairie de Blajan",
          structureType: "municipality",
          structureActivity: "local_authority",
          subscribedToNewsletter: true,
          createdAt: "2026-01-01T08:00:00.000Z",
          lastLoginAt: null,
          loginCount: 0,
        },
        timeline: [
          {
            date: "2026-01-03T10:00:00.000Z",
            type: "site_created",
            entityId: siteId,
            entityName: "Friche industrielle",
            emailType: null,
            deliveryStatus: null,
            deliveryAttempts: null,
            deliveryErrorMessage: null,
          },
          {
            date: "2026-01-01T08:00:00.000Z",
            type: "account_created",
            entityId: userId,
            entityName: null,
            emailType: null,
            deliveryStatus: null,
            deliveryAttempts: null,
            deliveryErrorMessage: null,
          },
        ],
        sites: [
          {
            id: siteId,
            name: "Friche industrielle",
            nature: "FRICHE",
            creationMode: "custom",
            status: "active",
            createdAt: "2026-01-03T10:00:00.000Z",
            updatedAt: null,
          },
        ],
        projects: [],
        compatibilityEvaluations: [],
      });
    });
  });
});
