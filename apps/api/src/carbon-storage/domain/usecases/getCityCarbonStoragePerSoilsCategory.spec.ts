import { LocalCarbonStorageRepository } from "src/carbon-storage/adapters/secondary/carbonStorageRepository/LocalCarbonStorageRepository.mock";
import { CarbonStorageRepository } from "../gateways/CarbonStorageRepository";
import { SoilCategory, SoilCategoryType } from "../models/soilCategory";
import { SurfaceArea } from "../models/surfaceArea";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "./getCityCarbonStoragePerSoilsCategory";

describe("GetTownCarbonStocksPerSoilsCategoryUseCase", () => {
  let carbonStorageRepository: CarbonStorageRepository;

  beforeEach(() => {
    carbonStorageRepository = new LocalCarbonStorageRepository();
  });

  test("it should compute the right total: simple example without forest", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageRepository);
    const result = await usecase.execute({
      cityCode: "01026",
      soils: [
        {
          surfaceArea: SurfaceArea.create(11500),
          type: SoilCategory.create(SoilCategoryType.CULTIVATION),
        },
        {
          surfaceArea: SurfaceArea.create(40000),
          type: SoilCategory.create(SoilCategoryType.PRAIRIE_BUSHES),
        },
      ],
    });

    const soilCultivation = 1.15 * 50;
    const prairieBushesCultivation = 4 * 69;
    const biomass = 4 * 7;

    expect(result.totalCarbonStorage).toEqual(soilCultivation + prairieBushesCultivation + biomass);
  });

  test("it should compute the right total: example with forest", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageRepository);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: SurfaceArea.create(1500),
          type: SoilCategory.create(SoilCategoryType.ARTIFICIAL_TREE_FILLED),
        },
        {
          surfaceArea: SurfaceArea.create(40000),
          type: SoilCategory.create(SoilCategoryType.PRAIRIE_BUSHES),
        },
        {
          surfaceArea: SurfaceArea.create(12000),
          type: SoilCategory.create(SoilCategoryType.FOREST_DECIDUOUS),
        },
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
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageRepository);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: SurfaceArea.create(15000),
          type: SoilCategory.create(SoilCategoryType.CULTIVATION),
        },
        {
          surfaceArea: SurfaceArea.create(30000),
          type: SoilCategory.create(SoilCategoryType.FOREST_DECIDUOUS),
        },
      ],
    });

    expect(result).toEqual({
      totalCarbonStorage: 632.61,
      soilsCarbonStorage: [
        {
          type: SoilCategoryType.CULTIVATION,
          surfaceArea: 15000,
          carbonStorage: 75,
        },
        {
          type: SoilCategoryType.FOREST_DECIDUOUS,
          surfaceArea: 30000,
          carbonStorage: 557.61,
        },
      ],
    });
  });

  test("it should return the right total for all kinds of impermeable soils", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageRepository);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: SurfaceArea.create(15000),
          type: SoilCategory.create(SoilCategoryType.IMPERMEABLE_SOILS),
        },
        {
          surfaceArea: SurfaceArea.create(30000),
          type: SoilCategory.create(SoilCategoryType.BUILDINGS),
        },
        {
          surfaceArea: SurfaceArea.create(20000),
          type: SoilCategory.create(SoilCategoryType.MINERAL_SOIL),
        },
      ],
    });

    const CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS = 30;

    expect(result).toEqual({
      totalCarbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * (1.5 + 3 + 2),
      soilsCarbonStorage: [
        {
          type: SoilCategoryType.IMPERMEABLE_SOILS,
          surfaceArea: 15000,
          carbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * 1.5,
        },
        {
          type: SoilCategoryType.BUILDINGS,
          surfaceArea: 30000,
          carbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * 3,
        },
        {
          type: SoilCategoryType.MINERAL_SOIL,
          surfaceArea: 20000,
          carbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * 2,
        },
      ],
    });
  });

  test("it should find no carbon for soils water", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageRepository);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: SurfaceArea.create(15000),
          type: SoilCategory.create(SoilCategoryType.WATER),
        },
      ],
    });

    expect(result).toEqual({
      totalCarbonStorage: 0,
      soilsCarbonStorage: [
        {
          type: SoilCategoryType.WATER,
          surfaceArea: 15000,
          carbonStorage: 0,
        },
      ],
    });
  });
});
