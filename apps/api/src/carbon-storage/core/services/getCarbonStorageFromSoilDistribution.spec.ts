import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test";
import { roundTo2Digits } from "shared";

import { LocalCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/LocalCarbonStorageQuery.mock";
import { SilentLogger } from "src/shared-kernel/adapters/logger/SilentLogger";

import type { CarbonStorageQuery } from "../gateways/CarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "./getCarbonStorageFromSoilDistribution";

describe("GetCarbonStorageFromSoilDistributionService", () => {
  let carbonStorageQuery: CarbonStorageQuery;

  beforeEach(() => {
    carbonStorageQuery = new LocalCarbonStorageQuery();
  });

  it("it should return undefined if city is not found", async () => {
    const service = new GetCarbonStorageFromSoilDistributionService(
      carbonStorageQuery,
      new SilentLogger(),
    );
    const result = await service.execute({
      cityCode: "62127",
      soilsDistribution: {
        CULTIVATION: 11500,
        PRAIRIE_BUSHES: 40000,
      },
    });

    assert.deepStrictEqual(result, undefined);
  });

  it("it should compute the right total: simple example without forest", async () => {
    const service = new GetCarbonStorageFromSoilDistributionService(
      carbonStorageQuery,
      new SilentLogger(),
    );
    const result = await service.execute({
      cityCode: "01026",
      soilsDistribution: {
        CULTIVATION: 11500,
        PRAIRIE_BUSHES: 40000,
      },
    });

    const soilCultivation = 1.15 * 50;
    const prairieBushesCultivation = 4 * 69;
    const biomass = 4 * 7;

    assert.ok(result !== undefined);
    assert.strictEqual(result.total, soilCultivation + prairieBushesCultivation + biomass);
    assert.ok(Math.abs((result.CULTIVATION ?? 0) - soilCultivation) < 0.005);
    assert.ok(
      Math.abs((result.PRAIRIE_BUSHES ?? 0) - (prairieBushesCultivation + biomass)) < 0.005,
    );
  });

  it("it should compute the right total: example with forest", async () => {
    const service = new GetCarbonStorageFromSoilDistributionService(
      carbonStorageQuery,
      new SilentLogger(),
    );
    const result = await service.execute({
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

    assert.ok(result !== undefined);
    assert.strictEqual(result.total, roundTo2Digits(total));
    assert.ok(
      Math.abs(
        (result.ARTIFICIAL_TREE_FILLED ?? 0) - (artificialSoil + biomassArtificialNonForest),
      ) < 0.005,
    );
    assert.ok(
      Math.abs(
        (result.PRAIRIE_BUSHES ?? 0) - (prairieBushesCultivation + biomassPrairieNonForest),
      ) < 0.005,
    );
    assert.ok(
      Math.abs(
        (result.FOREST_DECIDUOUS ?? 0) -
          (forestSoil + biomassForestLive + biomassForestDead + litterForest),
      ) < 0.005,
    );
  });
});
