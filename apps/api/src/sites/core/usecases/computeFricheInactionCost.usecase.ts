import { computeFricheDefaultYearlyExpenses } from "shared";

import { fail, success, TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";
import { CityImpactsDataProvider } from "src/territory/core/gateways/CityImpactsDataProvider";

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
  private readonly cityDataAndStatsQuery: CityImpactsDataProvider;
  constructor(cityDataAndStatsQuery: CityImpactsDataProvider) {
    this.cityDataAndStatsQuery = cityDataAndStatsQuery;
  }

  async execute({
    siteCityCode,
    siteSurfaceArea,
  }: Request): Promise<ComputeFricheInactionCostResult> {
    try {
      const { name, stats, isRural } =
        await this.cityDataAndStatsQuery.getCityDataAndStats(siteCityCode);

      const expenses = computeFricheDefaultYearlyExpenses({
        surfaceArea: siteSurfaceArea,
        cityPopulation: stats.population,
        isCityInRuralZone: isRural,
      });
      const amountByPurpose = new Map(expenses.map(({ purpose, amount }) => [purpose, amount]));

      return success({
        illegalDumpingCost: amountByPurpose.get("illegalDumpingCost") ?? 0,
        security: amountByPurpose.get("security"),
        siteCityData: { name, ...stats },
      });
    } catch {
      return fail("CITY_STATS_UNAVAILABLE");
    }
  }
}
