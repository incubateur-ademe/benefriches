import { MockLocalDataInseeService } from "src/location-features/adapters/secondary/city-data-provider/LocalDataInseeService.mock";
import { GetCityPopulationAndSurfaceAreaUseCase } from "./getCityPopulationAndSurfaceArea.usecase";

describe("getCityPopulationAndSurfaceArea use case", () => {
  let cityDataProvider: MockLocalDataInseeService;

  beforeEach(() => {
    cityDataProvider = new MockLocalDataInseeService();
  });

  test("it should return default value if error occured", async () => {
    const usecase = new GetCityPopulationAndSurfaceAreaUseCase(cityDataProvider);
    const result = await usecase.execute({ cityCode: "inconnu" });

    expect(result).toEqual({
      squareMetersSurfaceArea: 14900000,
      population: 1800,
    });
  });

  test("it should return population and surface area in square meters", async () => {
    const usecase = new GetCityPopulationAndSurfaceAreaUseCase(cityDataProvider);
    const result = await usecase.execute({ cityCode: "54321" });

    expect(result).toEqual({
      squareMetersSurfaceArea: 1183000,
      population: 471941,
    });
  });
});
