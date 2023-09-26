import { BadRequestException, NotFoundException } from "@nestjs/common";
import { MockLocalDataInseeService } from "src/location-features/adapters/secondary/town-data-provider/LocalDataInseeService.mock";
import { GetTownPopulationDensityUseCase } from "./getTownPopulationDensity.usecase";

describe("GetTownPopulationDensity use case", () => {
  let townDataProvider: MockLocalDataInseeService;

  beforeEach(() => {
    townDataProvider = new MockLocalDataInseeService();
  });

  test("it should throw BadRequestException if no cityCode is provided", async () => {
    const usecase = new GetTownPopulationDensityUseCase(townDataProvider);
    await expect(() => usecase.execute({ cityCode: "" })).rejects.toThrow(
      BadRequestException,
    );
  });

  test("it should throw NotFoundException if a wrong cityCode is provided", async () => {
    const usecase = new GetTownPopulationDensityUseCase(townDataProvider);

    await expect(() =>
      usecase.execute({ cityCode: "Wrong cityCode" }),
    ).rejects.toThrow(NotFoundException);
  });

  test("it should compute population density for Toulouse", async () => {
    const usecase = new GetTownPopulationDensityUseCase(townDataProvider);
    const result = await usecase.execute({ cityCode: "54321" });

    expect(result).toBeDefined();
    expect(result).toEqual({
      sources: { area: 118.3, population: 471941 },
      unit: "hab/km2",
      value: 3989.36,
    });
  });

  test("it should compute population density for a small town", async () => {
    const usecase = new GetTownPopulationDensityUseCase(townDataProvider);
    const result = await usecase.execute({ cityCode: "38375" });

    expect(result).toEqual({
      sources: { area: 123.5, population: 106 },
      unit: "hab/km2",
      value: 0.86,
    });
  });

  test("it should throw error if density is not computable", async () => {
    const usecase = new GetTownPopulationDensityUseCase(townDataProvider);
    await expect(() => usecase.execute({ cityCode: "01039" })).rejects.toThrow(
      NotFoundException,
    );
  });
});
