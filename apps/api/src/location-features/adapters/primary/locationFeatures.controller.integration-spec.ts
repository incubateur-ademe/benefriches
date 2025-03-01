import { INestApplication } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Test as NestTest } from "@nestjs/testing";
import { Server } from "net";
import supertest from "supertest";

import { AppModule } from "src/app.module";
import { configureServer } from "src/httpServer";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/location-features/core/usecases/getPhotovoltaicExpectedPerformanceUseCase";

import { MockCityDataService } from "../../../reconversion-projects/adapters/secondary/services/city-service/MockCityDataService";
import { MockPhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { LocationFeaturesController } from "./locationFeatures.controller";

describe("LocationFeatures controller", () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    const moduleRef = await NestTest.createTestingModule({
      imports: [AppModule],

      controllers: [LocationFeaturesController],
      providers: [
        {
          provide: "CityDataProvider",
          useClass: MockCityDataService,
        },
        {
          provide: "PhotovoltaicDataProvider",
          useClass: MockPhotovoltaicGeoInfoSystemApi,
        },
        {
          provide: GetPhotovoltaicExpectedPerformanceUseCase,
          useFactory: (dataProvider: MockPhotovoltaicGeoInfoSystemApi) =>
            new GetPhotovoltaicExpectedPerformanceUseCase(dataProvider),
          inject: ["PhotovoltaicDataProvider"],
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication<NestExpressApplication>();
    configureServer(app as NestExpressApplication);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Get /location-features/pv-expected-performance", () => {
    it("can't return information if there is no required parameters", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/api/location-features/pv-expected-performance",
      );

      expect(response.status).toEqual(400);
    });

    it("must return error if latitude or longitude parameters are wrong", async () => {
      const wrongLat = await supertest(app.getHttpServer()).get(
        "/api/location-features/pv-expected-performance?long=200&lat=2000&peakPower=3",
      );

      expect(wrongLat.status).toEqual(400);
    });

    it("must return error if peakPower is the wrong format", async () => {
      const wrongPeakPower = await supertest(app.getHttpServer()).get(
        "/api/location-features/pv-expected-performance?long=2.347&lat=48.859&peakPower=test",
      );

      expect(wrongPeakPower.status).toEqual(400);

      const wrongFormat = await supertest(app.getHttpServer()).get(
        "/api/location-features/pv-expected-performance?long=2.347&lat=48.859&peakPower=-15",
      );

      expect(wrongFormat.status).toEqual(400);
    });

    it("returns the expected power performance for a location and a peak power", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/api/location-features/pv-expected-performance?long=2.347&lat=48.859&peakPower=3.0",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        expectedPerformance: {
          kwhPerDay: 9.43,
          kwhPerMonth: 286.91,
          kwhPerYear: 3442.92,
          lossPercents: {
            angleIncidence: -2.98,
            spectralIncidence: 1.65,
            tempAndIrradiance: -5.73,
            total: -20.05,
          },
        },
      });
    });
  });
});
