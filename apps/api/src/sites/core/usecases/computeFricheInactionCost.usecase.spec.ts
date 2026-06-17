/* oxlint-disable typescript-eslint/no-unsafe-assignment */
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

    expect(result.isSuccess()).toBe(true);
    const data = (result as SuccessResult<FricheInactionCostData>).getData();
    expect(data).toEqual({
      illegalDumpingCost: expect.any(Number),
      security: expect.any(Number),
      siteCityData: {
        accuracy: "city",
        surfaceAreaSquareMeters: expect.any(Number),
        population: expect.any(Number),
        name: "Longlaville",
      },
    });
  });

  it("omits security cost for a rural city", async () => {
    const cityStatsQuery = new InMemoryCityStatsQuery();
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    cityRuralityQuery._setRuralCityCodes(["54321"]);
    const usecase = new ComputeFricheInactionCostUseCase(cityStatsQuery, cityRuralityQuery);

    const result = await usecase.execute({ siteCityCode: "54321", siteSurfaceArea: 5000 });

    expect(result.isSuccess()).toBe(true);
    const data = (result as SuccessResult<FricheInactionCostData>).getData();
    expect(data.security).toBeUndefined();
    expect(data.illegalDumpingCost).toBeGreaterThan(0);
  });

  it("fails with CITY_STATS_UNAVAILABLE when city stats query throws", async () => {
    const cityStatsQuery = new InMemoryCityStatsQuery();
    cityStatsQuery.shouldFail();
    const cityRuralityQuery = new InMemoryCityRuralityQuery();
    const usecase = new ComputeFricheInactionCostUseCase(cityStatsQuery, cityRuralityQuery);

    const result = await usecase.execute({ siteCityCode: "54321", siteSurfaceArea: 5000 });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"CITY_STATS_UNAVAILABLE">).getError()).toBe(
      "CITY_STATS_UNAVAILABLE",
    );
  });
});
