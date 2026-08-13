import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it, beforeEach } from "node:test";
import { GetPeriodicityStatsResponseDto } from "shared";
import request from "supertest";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("StatsController (e2e)", () => {
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

  beforeEach(async () => {
    await sqlConnection("reconversion_projects").del();
  });

  const insertProject = async (
    createdAt: Date,
    overrides: Partial<Record<string, unknown>> = {},
  ) => {
    const userId = uuid();
    const relatedSiteId = uuid();
    await sqlConnection("sites").insert({
      id: relatedSiteId,
      created_by: userId,
      name: "Site name",
      surface_area: 14000,
      owner_structure_type: "company",
      created_at: new Date(),
    });
    await sqlConnection("reconversion_projects").insert({
      id: uuid(),
      created_by: userId,
      creation_mode: "custom",
      status: "active",
      name: "Test project",
      related_site_id: relatedSiteId,
      project_phase: "setup",
      involves_reinstatement: false,
      created_at: createdAt,
      ...overrides,
    });
  };

  describe("GET /api/stats", () => {
    it("returns 3 projects", async () => {
      const now = new Date();
      const startOfDay = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
      );

      await insertProject(new Date(startOfDay.getTime() + 1000 * 60 * 60 * 2)); // 02h
      await insertProject(new Date(startOfDay.getTime() + 1000 * 60 * 60 * 5)); // 05h
      await insertProject(new Date(startOfDay.getTime() + 1000 * 60 * 60 * 10)); // 10h

      const res = await request(app.getHttpServer())
        .get("/api/stats")
        .query({ periodicity: "day", since: 1 });

      assert.strictEqual(res.status, 200);

      const todayStat = (res.body as GetPeriodicityStatsResponseDto).stats.find(
        (s: { date: number; value: number }) => s.date === startOfDay.getTime(),
      );
      assert.strictEqual(todayStat?.value, 3);
    });

    it("returns 0 for periods with no data", async () => {
      const now = new Date();
      await insertProject(now);

      const res = await request(app.getHttpServer())
        .get("/api/stats")
        .query({ periodicity: "day", since: 5 });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.stats.length >= 5);

      const zeroValues = (res.body as GetPeriodicityStatsResponseDto).stats.filter(
        (s: { value: number }) => s.value === 0,
      );
      assert.ok(zeroValues.length > 0);
    });

    it("returns timestamp date", async () => {
      await insertProject(new Date());

      const res = await request(app.getHttpServer())
        .get("/api/stats")
        .query({ periodicity: "day", since: 1 });

      for (const stat of res.body.stats) {
        assert.strictEqual(typeof stat.date, "number");
        const d = new Date(stat.date);
        assert.strictEqual(d.getUTCHours(), 0);
        assert.strictEqual(d.getUTCMinutes(), 0);
        assert.strictEqual(d.getUTCSeconds(), 0);
      }
    });

    it("returns 400 if periodicity invalid", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/stats")
        .query({ periodicity: "century" });

      assert.strictEqual(res.status, 400);
    });

    it("returns 400 if since is invalid string", async () => {
      const res = await request(app.getHttpServer()).get("/api/stats").query({ since: "abc" });

      assert.strictEqual(res.status, 400);
    });

    it("returns 400 if since is negative", async () => {
      const res = await request(app.getHttpServer()).get("/api/stats").query({ since: -1 });

      assert.strictEqual(res.status, 400);
    });

    it("returns 400 if since is too high", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/stats")
        .query({ since: 999999, periodicity: "day" });

      assert.strictEqual(res.status, 400);
    });

    it("coerces string to number", async () => {
      const res = await request(app.getHttpServer())
        .get("/api/stats")
        .query({ since: "3", periodicity: "month" });

      assert.strictEqual(res.status, 200);
    });

    it("returns 405 for POST", async () => {
      const res = await request(app.getHttpServer()).post("/api/stats");
      assert.strictEqual(res.status, 405);
    });

    it("returns 405 for DELETE", async () => {
      const res = await request(app.getHttpServer()).delete("/api/stats");
      assert.strictEqual(res.status, 405);
    });

    it("returns 405 for PUT", async () => {
      const res = await request(app.getHttpServer()).put("/api/stats");
      assert.strictEqual(res.status, 405);
    });
  });
});
