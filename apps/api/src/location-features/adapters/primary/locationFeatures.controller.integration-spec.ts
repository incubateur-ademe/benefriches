import { INestApplication } from "@nestjs/common";
import { Test as NestTest } from "@nestjs/testing";
import supertest from "supertest";
import { AppModule } from "src/app.module";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/location-features/domain/usecases/getPhotovoltaicExpectedPerformanceUseCase";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";
import { MockPhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi.mock";
import { MockLocalDataInseeService } from "../secondary/town-data-provider/LocalDataInseeService.mock";
import { LocationFeaturesController } from "./locationFeatures.controller";

describe("LocationFeatures controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await NestTest.createTestingModule({
      imports: [AppModule],

      controllers: [LocationFeaturesController],
      providers: [
        {
          provide: "TownDataProvider",
          useClass: MockLocalDataInseeService,
        },
        {
          provide: GetTownPopulationDensityUseCase,
          useFactory: (townDataProvider: MockLocalDataInseeService) =>
            new GetTownPopulationDensityUseCase(townDataProvider),
          inject: ["TownDataProvider"],
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

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("Get /location-features", () => {
    it("can't return information if there is no location indication", async () => {
      const response = await supertest(app.getHttpServer()).get("/location-features");

      expect(response.status).toEqual(400);
    });

    it("returns an object with the population density if a right city code is provided", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/location-features?cityCode=75056",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        cityCode: "75056",
        populationDensity: {
          sources: {
            area: 10540,
            population: 2145906,
          },
          unit: "hab/km2",
          value: 203.6,
        },
      });
    });
  });

  describe("Get /location-features/pv-expected-performance", () => {
    it("can't return information if there is no required parameters", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/location-features/pv-expected-performance",
      );

      expect(response.status).toEqual(400);
    });

    it("must return error if latitude or longitude parameters are wrong", async () => {
      const wrongLat = await supertest(app.getHttpServer()).get(
        "/location-features/pv-expected-performance?long=200&lat=2000&peakPower=3",
      );

      expect(wrongLat.status).toEqual(400);
    });

    it("must return error if peakPower is the wrong format", async () => {
      const wrongPeakPower = await supertest(app.getHttpServer()).get(
        "/location-features/pv-expected-performance?long=2.347&lat=48.859&peakPower=test",
      );

      expect(wrongPeakPower.status).toEqual(400);

      const wrongFormat = await supertest(app.getHttpServer()).get(
        "/location-features/pv-expected-performance?long=2.347&lat=48.859&peakPower=-15",
      );

      expect(wrongFormat.status).toEqual(400);
    });

    it("returns the expected power performance for a location and a peak power", async () => {
      const response = await supertest(app.getHttpServer()).get(
        "/location-features/pv-expected-performance?long=2.347&lat=48.859&peakPower=3.0",
      );

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        computationContext: {
          location: { lat: 48.859, long: 2.347, elevation: 49 },
          dataSources: {
            radiation: "PVGIS-SARAH2",
            meteo: "ERA5",
            period: "2005 - 2020",
            horizon: "DEM-calculated",
          },
          pvInstallation: {
            technology: "c-Si",
            peakPower: 3,
            systemLoss: 14,
            slope: { value: 35, optimal: false },
            azimuth: { value: 0, optimal: false },
            type: "free-standing",
          },
        },
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
