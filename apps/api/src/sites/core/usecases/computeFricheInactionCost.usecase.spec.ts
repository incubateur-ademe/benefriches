/* oxlint-disable typescript-eslint/no-unsafe-assignment */
import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemoryCityRuralityQuery } from "src/territory/adapters/secondary/city-rurality-query/InMemoryCityRuralityQuery";
import { InMemoryCityStatsQuery } from "src/territory/adapters/secondary/city-stats-query/InMemoryCityStatsQuery";

import { ComputeFricheInactionCostUseCase } from "./computeFricheInactionCost.usecase";

type FricheInactionCostData = {
  illegalDumpingCost: number;
  security?: number;
  siteCityData: {
    accuracy: "city" | "france";
    surfaceAreaSquareMeters: number;
    population: number;
    name: string;
  };
};

describe("ComputeFricheInactionCost UseCase", () => {
  it("returns illegal dumping and security costs for a non-rural city", async () => {
    const cityStatsQuery = new InMemoryCityStatsQuery();
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    const usecase = new ComputeFricheInactionCostUseCase(cityStatsQuery, cityRuralityQuery);

    const result = await usecase.execute({ siteCityCode: "54321", siteSurfaceArea: 5000 });

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<FricheInactionCostData>).getData();
    assert.ok(typeof data.illegalDumpingCost === "number");
    assert.ok(typeof data.security === "number");
    assert.partialDeepStrictEqual(data.siteCityData, {
      accuracy: "city",
      name: "Longlaville",
    });
    assert.ok(typeof data.siteCityData.surfaceAreaSquareMeters === "number");
    assert.ok(typeof data.siteCityData.population === "number");
  });

  it("omits security cost for a rural city", async () => {
    const cityStatsQuery = new InMemoryCityStatsQuery();
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    cityRuralityQuery._setRuralCityCodes(["54321"]);
    const usecase = new ComputeFricheInactionCostUseCase(cityStatsQuery, cityRuralityQuery);

    const result = await usecase.execute({ siteCityCode: "54321", siteSurfaceArea: 5000 });

    assert.strictEqual(result.isSuccess(), true);
    const data = (result as SuccessResult<FricheInactionCostData>).getData();
    assert.strictEqual(data.security, undefined);
    assert.ok(data.illegalDumpingCost > 0);
  });

  it("fails with CITY_STATS_UNAVAILABLE when city stats query throws", async () => {
    const cityStatsQuery = new InMemoryCityStatsQuery();
    cityStatsQuery.shouldFail();
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    const usecase = new ComputeFricheInactionCostUseCase(cityStatsQuery, cityRuralityQuery);

    const result = await usecase.execute({ siteCityCode: "54321", siteSurfaceArea: 5000 });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual(
      (result as FailureResult<"CITY_STATS_UNAVAILABLE">).getError(),
      "CITY_STATS_UNAVAILABLE",
    );
  });
});
