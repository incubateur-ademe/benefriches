import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { createTestApp } from "test/testApp";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

type HealthCheckResponse = {
  status: string;
  timestamp: string;
  checks: {
    database: string;
  };
};

describe("Healthcheck controller", () => {
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

  describe("GET /healthcheck", () => {
    it("returns 200 with healthy status when database is connected", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/healthcheck");
      const body = response.body as HealthCheckResponse;

      assert.strictEqual(response.status, 200);
      assert.strictEqual(body.status, "healthy");
      assert.strictEqual(body.checks.database, "connected");
      assert.strictEqual(typeof body.timestamp, "string");
    });

    it("returns a valid ISO 8601 timestamp", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/healthcheck");
      const body = response.body as HealthCheckResponse;

      assert.strictEqual(response.status, 200);
      assert.strictEqual(typeof body.timestamp, "string");
      assert.strictEqual(new Date(body.timestamp).toISOString(), body.timestamp);
    });
  });
});
