import { computeFricheDefaultYearlyExpenses } from "shared";

import { fail, success, TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { CityRuralityQuery } from "src/territory/core/gateways/CityRuralityQuery";
import { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

type Request = {
  siteCityCode: string;
  siteSurfaceArea: number;
};

type ComputeFricheInactionCostResult = TResult<
  {
    illegalDumpingCost: number;
    security?: number;
    siteCityData: {
      accuracy: "city" | "france";
      surfaceAreaSquareMeters: number;
      population: number;
      name: string;
    };
  },
  "CITY_STATS_UNAVAILABLE"
>;

export class ComputeFricheInactionCostUseCase implements UseCase<
  Request,
  ComputeFricheInactionCostResult
> {
  private readonly cityStatsQuery: CityStatsProvider;
  private readonly cityRuralityQuery: CityRuralityQuery;
  constructor(cityStatsQuery: CityStatsProvider, cityRuralityQuery: CityRuralityQuery) {
    this.cityStatsQuery = cityStatsQuery;
    this.cityRuralityQuery = cityRuralityQuery;
  }

  async execute({
    siteCityCode,
    siteSurfaceArea,
  }: Request): Promise<ComputeFricheInactionCostResult> {
    try {
      const [{ surfaceAreaSquareMeters, population, name, accuracy }, isCityInRuralZone] =
        await Promise.all([
          this.cityStatsQuery.getCityStats(siteCityCode),
          this.cityRuralityQuery.isCityRural(siteCityCode),
        ]);

      const expenses = computeFricheDefaultYearlyExpenses({
        surfaceArea: siteSurfaceArea,
        cityPopulation: population,
        isCityInRuralZone,
      });
      const amountByPurpose = new Map(expenses.map(({ purpose, amount }) => [purpose, amount]));

      return success({
        illegalDumpingCost: amountByPurpose.get("illegalDumpingCost") ?? 0,
        security: amountByPurpose.get("security"),
        siteCityData: {
          accuracy,
          surfaceAreaSquareMeters,
          population,
          name,
        },
      });
    } catch {
      return fail("CITY_STATS_UNAVAILABLE");
    }
  }
}
