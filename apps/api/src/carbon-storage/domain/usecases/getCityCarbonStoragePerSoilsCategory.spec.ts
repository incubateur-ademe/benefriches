import { LocalCarbonStorageRepository } from "src/carbon-storage/adapters/secondary/carbonStorageRepository/LocalCarbonStorageRepository.mock";
import { CarbonStorageRepository } from "../gateways/CarbonStorageRepository";
import { SoilCategoryType } from "../models/carbonStorage";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "./getCityCarbonStoragePerSoilsCategory";

describe("GetTownCarbonStocksPerSoilsCategoryUseCase", () => {
  let carbonStorageRepository: CarbonStorageRepository;

  beforeEach(() => {
    carbonStorageRepository = new LocalCarbonStorageRepository();
  });

  test("it should compute the right total: simple example without forest", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(
      carbonStorageRepository,
    );
    const result = await usecase.execute({
      cityCode: "01026",
      soils: [
        { surfaceArea: 1.15, type: SoilCategoryType.CULTIVATION },
        { surfaceArea: 4, type: SoilCategoryType.PRAIRIE_BUSHES },
      ],
    });

    const soilCultivation = 1.15 * 50;
    const prairieBushesCultivation = 4 * 69;
    const biomass = 4 * 7;

    expect(result.totalCarbonStorage).toEqual(
      soilCultivation + prairieBushesCultivation + biomass,
    );
  });

  test("it should compute the right total: example with forest", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(
      carbonStorageRepository,
    );
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        { surfaceArea: 0.15, type: SoilCategoryType.ARTIFICIAL_TREE_FILLED },
        { surfaceArea: 4, type: SoilCategoryType.PRAIRIE_BUSHES },
        { surfaceArea: 1.2, type: SoilCategoryType.FOREST_DECIDUOUS },
      ],
    });

    const artificialSoil = 0.15 * 60;
    const prairieBushesCultivation = 4 * 69;
    const forestSoil = 1.2 * 60;
    const biomassPrairieNonForest = 4 * 7;
    const biomassArtificialNonForest = 0.15 * 57;
    const biomassForestLive = 1.2 * 104.78;
    const biomassForestDead = 1.2 * 12.09;
    const litterForest = 1.2 * 9;
    const total =
      artificialSoil +
      prairieBushesCultivation +
      forestSoil +
      biomassForestDead +
      biomassForestLive +
      biomassPrairieNonForest +
      biomassArtificialNonForest +
      litterForest;

    expect(result.totalCarbonStorage).toEqual(Math.round(total * 100) / 100);
  });

  test("it should return the right object format with forest value", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(
      carbonStorageRepository,
    );
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        { surfaceArea: 1.5, type: SoilCategoryType.CULTIVATION },
        { surfaceArea: 3, type: SoilCategoryType.FOREST_DECIDUOUS },
      ],
    });

    expect(result).toEqual({
      totalCarbonStorage: 632.61,
      soilsCarbonStorage: [
        {
          type: SoilCategoryType.CULTIVATION,
          surfaceArea: 1.5,
          carbonStorage: 75,
        },
        {
          type: SoilCategoryType.FOREST_DECIDUOUS,
          surfaceArea: 3,
          carbonStorage: 557.61,
        },
      ],
    });
  });
});
