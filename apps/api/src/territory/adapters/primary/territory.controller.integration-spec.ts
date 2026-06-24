import type { NestExpressApplication } from "@nestjs/platform-express/interfaces/nest-express-application.interface";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import supertest from "supertest";
import { createTestApp } from "test/testApp";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("Territory controller", () => {
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

  describe("GET /territory/city-rurality", () => {
    it("returns 400 when cityCode is missing", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/territory/city-rurality");

      assert.strictEqual(response.status, 400);
    });

    it("returns isRural true for a commune in the FRR rural list", async () => {
      // 01029 (Beaupont) is classified "FRR socle" in the seeded FRR list
      const response = await supertest(app.getHttpServer()).get(
        "/api/territory/city-rurality?cityCode=01029",
      );

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, { cityCode: "01029", isRural: true });
    });

    it("returns isRural false for a commune that is 'Non classée'", async () => {
      // 01001 (L'Abergement-Clémenciat) is "Non classée"
      const response = await supertest(app.getHttpServer()).get(
        "/api/territory/city-rurality?cityCode=01001",
      );

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, { cityCode: "01001", isRural: false });
    });
  });
});
