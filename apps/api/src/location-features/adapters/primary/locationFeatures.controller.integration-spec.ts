import { INestApplication } from "@nestjs/common";
import { Test as NestTest } from "@nestjs/testing";
import supertest from "supertest";
import { CarbonStocksPerSoilsCategoryDataProvider } from "src/location-features/domain/gateways/CarbonStocksPerSoilCategoryDataProvider";
import { GetTownCarbonStocksPerSoilsCategoryUseCase } from "src/location-features/domain/usecases/getTownCarbonStocksPerSoilsCategory";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";
import { CarbonStocksPerSoilsCategoryService } from "../secondary/town-data-provider/CarbonStocksPerSoilsCategoryService";
import { MockLocalDataInseeService } from "../secondary/town-data-provider/LocalDataInseeService.mock";
import { LocationFeaturesController } from "./locationFeatures.controller";

describe("LocationFeatures controller", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await NestTest.createTestingModule({
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
          provide: "CarbonStocksPerSoilsCategoryDataProvider",
          useClass: CarbonStocksPerSoilsCategoryService,
        },
        {
          provide: GetTownCarbonStocksPerSoilsCategoryUseCase,
          useFactory: (
            dataProvider: CarbonStocksPerSoilsCategoryDataProvider,
          ) => new GetTownCarbonStocksPerSoilsCategoryUseCase(dataProvider),
          inject: ["CarbonStocksPerSoilsCategoryDataProvider"],
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
        populationDensity: {
          sources: {
            area: 10540,
            population: 2145906,
          },
          unit: "hab/km2",
          value: 203.6,
        },
        carbonStocks: {
          cityCode: "75056",
          stocks: {
            artificial_bushy_and_tree_filled_soils: 83,
            artificial_grassed_soils: 55,
            artificial_impermeable_soils: 30,
            artificialised_soils: 27.5,
            cultivation: 43,
            forest: 83,
            orchard: 46,
            prairie: 55,
            vineyard: 39,
            wet_land: 125,
          },
          stocksUnit: "tC/ha",
          zpcCode: "2_2",
          zpcDescription: {
            climat: "Climat chaud tempéré sec",
            texture: "Moyenne",
          },
        },
      });
    });
  });
});
