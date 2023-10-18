import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import supertest from "supertest";
import { AppModule } from "src/app.module";
import { SoilCategoryType } from "src/carbon-storage/domain/models/carbonStorage";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

describe("CarbonStorage controller", () => {
  let app: INestApplication;
  let sqlConnection: Knex;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(ConfigModule)
      .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("Get /carbon-storage", () => {
    it("can't return information if there is no cityCode indication", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/carbon-storage",
      );

      expect(response.status).toEqual(400);
    });

    it("returns an object with totalCarbonStorage and soilsCarbonStorage", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/carbon-storage?cityCode=01081&soils[0][surfaceArea]=1.5&soils[0][type]=CULTIVATION&soils[1][surfaceArea]=3&soils[1][type]=FOREST_DECIDUOUS",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        totalCarbonStorage: 739.11,
        soilsCarbonStorage: [
          {
            type: SoilCategoryType.CULTIVATION,
            surfaceArea: 1.5,
            carbonStorage: 82.5,
          },
          {
            type: SoilCategoryType.FOREST_DECIDUOUS,
            surfaceArea: 3,
            carbonStorage: 656.61,
          },
        ],
      });
    });
  });
});
