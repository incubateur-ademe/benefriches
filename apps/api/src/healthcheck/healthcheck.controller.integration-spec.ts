import type { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
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

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("GET /healthcheck", () => {
    it("returns 200 with healthy status when database is connected", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/healthcheck");
      const body = response.body as HealthCheckResponse;

      expect(response.status).toEqual(200);
      expect(body.status).toEqual("healthy");
      expect(body.checks.database).toEqual("connected");
      expect(typeof body.timestamp).toBe("string");
    });

    it("returns a valid ISO 8601 timestamp", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/healthcheck");
      const body = response.body as HealthCheckResponse;

      expect(response.status).toEqual(200);
      expect(typeof body.timestamp).toBe("string");
      expect(new Date(body.timestamp).toISOString()).toEqual(body.timestamp);
    });
  });
});
