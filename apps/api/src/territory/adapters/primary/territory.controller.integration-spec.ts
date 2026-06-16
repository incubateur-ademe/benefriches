import { NestExpressApplication } from "@nestjs/platform-express/interfaces/nest-express-application.interface";
import { Knex } from "knex";
import supertest from "supertest";
import { createTestApp } from "test/testApp";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("Territory controller", () => {
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

  describe("GET /territory/city-rurality", () => {
    it("returns 400 when cityCode is missing", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/territory/city-rurality");

      expect(response.status).toEqual(400);
    });

    it("returns isRural true for a commune in the FRR rural list", async () => {
      // 01029 (Beaupont) is classified "FRR socle" in the seeded FRR list
      const response = await supertest(app.getHttpServer()).get(
        "/api/territory/city-rurality?cityCode=01029",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ cityCode: "01029", isRural: true });
    });

    it("returns isRural false for a commune that is 'Non classée'", async () => {
      // 01001 (L'Abergement-Clémenciat) is "Non classée"
      const response = await supertest(app.getHttpServer()).get(
        "/api/territory/city-rurality?cityCode=01001",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ cityCode: "01001", isRural: false });
    });
  });
});
