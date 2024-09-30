import { MockLocalDataInseeService } from "src/location-features/adapters/secondary/city-data-provider/LocalDataInseeService.mock";

import { GetCityPopulationDensityUseCase } from "./getCityPopulationDensity.usecase";

describe("GetCityPopulationDensity use case", () => {
  let cityDataProvider: MockLocalDataInseeService;

  beforeEach(() => {
    cityDataProvider = new MockLocalDataInseeService();
  });

  test("it should throw Error if a wrong cityCode is provided", async () => {
    const usecase = new GetCityPopulationDensityUseCase(cityDataProvider);

    await expect(() => usecase.execute({ cityCode: "Wrong cityCode" })).rejects.toThrow(Error);
  });

  test("it should compute population density for Toulouse", async () => {
    const usecase = new GetCityPopulationDensityUseCase(cityDataProvider);
    const result = await usecase.execute({ cityCode: "54321" });

    expect(result).toBeDefined();
    expect(result).toEqual({
      sources: { area: 118.3, population: 471941 },
      unit: "hab/km2",
      value: 3989.36,
    });
  });

  test("it should compute population density for a small city", async () => {
    const usecase = new GetCityPopulationDensityUseCase(cityDataProvider);
    const result = await usecase.execute({ cityCode: "38375" });

    expect(result).toEqual({
      sources: { area: 123.5, population: 106 },
      unit: "hab/km2",
      value: 0.86,
    });
  });

  test("it should throw error if density is not computable", async () => {
    const usecase = new GetCityPopulationDensityUseCase(cityDataProvider);
    await expect(() => usecase.execute({ cityCode: "01039" })).rejects.toThrow(Error);
  });
});
