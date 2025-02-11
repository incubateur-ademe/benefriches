import { MockCityDataService } from "src/location-features/adapters/secondary/city-data-provider/MockCityDataService";
import { MockDV3FApiService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService.mock";

import { GetCityRelatedDataService } from "./getCityRelatedData";

describe("GetCityRelatedDataService", () => {
  let cityPropertyValueProvider: MockDV3FApiService;
  let cityDataProvider: MockCityDataService;

  beforeAll(() => {
    cityDataProvider = new MockCityDataService();
    cityPropertyValueProvider = new MockDV3FApiService();
  });

  describe("getCityPropertyValuePerSquareMeter method", () => {
    beforeEach(() => {
      cityPropertyValueProvider = new MockDV3FApiService();
    });

    test("it should return default value if error occured", async () => {
      const service = new GetCityRelatedDataService(cityDataProvider, cityPropertyValueProvider);
      const result = await service.getPropertyValuePerSquareMeter("wrong");

      expect(result).toEqual({
        medianPricePerSquareMeters: 3064,
        referenceYear: "2024",
      });
    });

    test("it should return medianPricePerSquareMeters and referenceYear", async () => {
      const service = new GetCityRelatedDataService(cityDataProvider, cityPropertyValueProvider);
      const result = await service.getPropertyValuePerSquareMeter("54321");

      expect(result).toEqual({
        medianPricePerSquareMeters: 2500,
        referenceYear: "2022",
      });
    });
  });

  describe("getCityPopulationAndSurfaceArea use case", () => {
    let cityDataProvider: MockCityDataService;

    beforeEach(() => {
      cityDataProvider = new MockCityDataService();
    });

    test("it should return default value if error occured", async () => {
      const service = new GetCityRelatedDataService(cityDataProvider, cityPropertyValueProvider);
      const result = await service.getCityPopulationAndSurfaceArea("inconnu");

      expect(result).toEqual({
        squareMetersSurfaceArea: 14900000,
        population: 1800,
      });
    });

    test("it should return population and surface area in square meters", async () => {
      const service = new GetCityRelatedDataService(cityDataProvider, cityPropertyValueProvider);
      const result = await service.getCityPopulationAndSurfaceArea("54321");

      expect(result).toEqual({
        squareMetersSurfaceArea: 1183000,
        population: 471941,
      });
    });
  });
});
