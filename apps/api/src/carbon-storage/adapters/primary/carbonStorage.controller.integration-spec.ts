import { INestApplication } from "@nestjs/common";
import { Knex } from "knex";
import { Server } from "net";
import supertest from "supertest";
import { createTestApp } from "test/testApp";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("CarbonStorage controller", () => {
  let app: INestApplication<Server>;
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

  describe("Get /carbon-storage/site-soils", () => {
    it("can't return information if there is no cityCode indication", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/carbon-storage/site-soils");

      expect(response.status).toEqual(400);
    });

    it("can't return information if there is no soils indication", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/api/carbon-storage/site-soils?cityCode=01081",
      );

      expect(response.status).toEqual(400);
    });

    describe("it returns 400 error if soils parameter format is incorrect", () => {
      const WRONG_SOILS_PARAMS = [
        "soils[0][surfaceArea]=1500&soils[0][type]=culture",
        "soils[0][surfaceArea]=dix&soils[0][type]=CULTIVATION",
        "soils[0][surfaceArea]=-2354&soils[0][type]=CULTIVATION",
      ];

      test.each(WRONG_SOILS_PARAMS)(
        "given %p and %p as arguments, returns %p",
        async (soilsParam) => {
          const response = await supertest(app.getHttpServer()).get(
            `/api/carbon-storage/site-soils?cityCode=01081&${soilsParam}`,
          );

          expect(response.status).toEqual(400);
        },
      );
    });

    it("returns an object with totalCarbonStorage and soilsCarbonStorage", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/api/carbon-storage/site-soils?cityCode=01081&soils[0][surfaceArea]=1500&soils[0][type]=CULTIVATION&soils[1][surfaceArea]=3000&soils[1][type]=FOREST_DECIDUOUS",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        totalCarbonStorage: 73.91,
        soilsStorage: [
          {
            type: "CULTIVATION",
            surfaceArea: 1500,
            carbonStorage: 8.25,
            carbonStorageInTonPerSquareMeters: 0.0055,
          },
          {
            type: "FOREST_DECIDUOUS",
            carbonStorageInTonPerSquareMeters: 0.021887,
            surfaceArea: 3000,
            carbonStorage: 65.661,
          },
        ],
      });
    });
  });
});
