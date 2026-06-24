import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { roundTo2Digits } from "shared";

import { LocalCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/LocalCarbonStorageQuery.mock";
import { SuccessResult } from "src/shared-kernel/result";

import { CarbonStorageQuery } from "../gateways/CarbonStorageQuery";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "./getCityCarbonStoragePerSoilsCategory";

describe("GetCityCarbonStocksPerSoilsCategoryUseCase", () => {
  let carbonStorageQuery: CarbonStorageQuery;

  beforeEach(() => {
    carbonStorageQuery = new LocalCarbonStorageQuery();
  });

  it("it should compute the right total: simple example without forest", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01026",
      soils: [
        {
          surfaceArea: 11500,
          type: "CULTIVATION",
        },
        {
          surfaceArea: 40000,
          type: "PRAIRIE_BUSHES",
        },
      ],
    });

    const soilCultivation = 1.15 * 50;
    const prairieBushesCultivation = 4 * 69;
    const biomass = 4 * 7;

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual(
      (result as SuccessResult<{ totalCarbonStorage: number }>).getData().totalCarbonStorage,
      soilCultivation + prairieBushesCultivation + biomass,
    );
  });

  it("it should compute the right total: example with forest", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: 1500,
          type: "ARTIFICIAL_TREE_FILLED",
        },
        {
          surfaceArea: 40000,
          type: "PRAIRIE_BUSHES",
        },
        {
          surfaceArea: 12000,
          type: "FOREST_DECIDUOUS",
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

    assert.deepStrictEqual(
      (result as SuccessResult<{ totalCarbonStorage: number }>).getData().totalCarbonStorage,
      roundTo2Digits(total),
    );
  });

  it("it should return the right object format with forest value", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: 15000,
          type: "CULTIVATION",
        },
        {
          surfaceArea: 30000,
          type: "FOREST_DECIDUOUS",
        },
      ],
    });

    assert.strictEqual(result.isSuccess(), true);
    const successResult = result as SuccessResult;
    // oxlint-disable-next-line typescript/no-confusing-void-expression
    const data = successResult.getData();
    assert.deepStrictEqual(data, {
      totalCarbonStorage: 632.61,
      soilsCarbonStorage: [
        {
          type: "CULTIVATION",
          surfaceArea: 15000,
          carbonStorage: 75,
          carbonStorageInTonPerSquareMeters: 0.005,
        },
        {
          type: "FOREST_DECIDUOUS",
          surfaceArea: 30000,
          carbonStorage: 557.61,
          carbonStorageInTonPerSquareMeters: 0.018587,
        },
      ],
    });
  });

  it("it should return the right total for all kinds of impermeable soils", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: 15000,
          type: "IMPERMEABLE_SOILS",
        },
        {
          surfaceArea: 30000,
          type: "BUILDINGS",
        },
        {
          surfaceArea: 20000,
          type: "MINERAL_SOIL",
        },
      ],
    });

    const CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS = 30;

    assert.strictEqual(result.isSuccess(), true);
    const successResult = result as SuccessResult;
    // oxlint-disable-next-line typescript/no-confusing-void-expression
    const data = successResult.getData();
    assert.deepStrictEqual(data, {
      totalCarbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * (1.5 + 3 + 2),
      soilsCarbonStorage: [
        {
          type: "IMPERMEABLE_SOILS",
          surfaceArea: 15000,
          carbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * 1.5,
          carbonStorageInTonPerSquareMeters: 0.003,
        },
        {
          type: "BUILDINGS",
          surfaceArea: 30000,
          carbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * 3,
          carbonStorageInTonPerSquareMeters: 0.003,
        },
        {
          type: "MINERAL_SOIL",
          surfaceArea: 20000,
          carbonStorage: CARBON_STORAGE_BY_HECTARE_FOR_IMPERMEABLE_SOILS * 2,
          carbonStorageInTonPerSquareMeters: 0.003,
        },
      ],
    });
  });

  it("it should find no carbon for soils water", async () => {
    const usecase = new GetCityCarbonStoragePerSoilsCategoryUseCase(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01027",
      soils: [
        {
          surfaceArea: 15000,
          type: "WATER",
        },
      ],
    });

    assert.strictEqual(result.isSuccess(), true);
    const successResult = result as SuccessResult;
    // oxlint-disable-next-line typescript/no-confusing-void-expression
    const data = successResult.getData();
    assert.deepStrictEqual(data, {
      totalCarbonStorage: 0,
      soilsCarbonStorage: [
        {
          type: "WATER",
          surfaceArea: 15000,
          carbonStorage: 0,
          carbonStorageInTonPerSquareMeters: 0,
        },
      ],
    });
  });
});
