import { roundTo2Digits } from "shared";

import { LocalCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/LocalCarbonStorageQuery.mock";

import { CarbonStorageQuery } from "../gateways/CarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "./getCarbonStorageFromSoilDistribution";

describe("GetCarbonStorageFromSoilDistributionService", () => {
  let carbonStorageQuery: CarbonStorageQuery;

  beforeEach(() => {
    carbonStorageQuery = new LocalCarbonStorageQuery();
  });

  test("it should return undefined if city is not found", async () => {
    const usecase = new GetCarbonStorageFromSoilDistributionService(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "62127",
      soilsDistribution: {
        CULTIVATION: 11500,
        PRAIRIE_BUSHES: 40000,
      },
    });

    expect(result).toEqual(undefined);
  });

  test("it should compute the right total: simple example without forest", async () => {
    const usecase = new GetCarbonStorageFromSoilDistributionService(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01026",
      soilsDistribution: {
        CULTIVATION: 11500,
        PRAIRIE_BUSHES: 40000,
      },
    });

    const soilCultivation = 1.15 * 50;
    const prairieBushesCultivation = 4 * 69;
    const biomass = 4 * 7;

    expect(result).toEqual(soilCultivation + prairieBushesCultivation + biomass);
  });

  test("it should compute the right total: example with forest", async () => {
    const usecase = new GetCarbonStorageFromSoilDistributionService(carbonStorageQuery);
    const result = await usecase.execute({
      cityCode: "01027",
      soilsDistribution: {
        ARTIFICIAL_TREE_FILLED: 1500,
        PRAIRIE_BUSHES: 40000,
        FOREST_DECIDUOUS: 12000,
      },
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

    expect(result).toEqual(roundTo2Digits(total));
  });
});
