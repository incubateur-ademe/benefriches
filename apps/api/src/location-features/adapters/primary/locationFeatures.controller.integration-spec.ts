import { INestApplication } from "@nestjs/common";
import { Test as NestTest } from "@nestjs/testing";
import supertest from "supertest";
import { LocationFeaturesModule } from "./locationFeatures.module";

describe("LocationFeatures controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await NestTest.createTestingModule({
      imports: [LocationFeaturesModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Get /location-features", () => {
    it("can't return information if there is no location indication", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/location-features",
      );

      expect(response.status).toEqual(400);
    });

    it("returns an object with the population density if a right city code is provided", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/location-features?cityCode=75056",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        cityCode: "75056",
        populationDensity: 203.6,
      });
    });
  });
});
