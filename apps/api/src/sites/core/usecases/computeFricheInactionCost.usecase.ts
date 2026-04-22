import { computeIllegalDumpingDefaultCost, computeSecurityDefaultCost } from "shared";

import { CityStatsProvider } from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { fail, success, TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

type Request = {
  siteCityCode: string;
  siteSurfaceArea: number;
};

type ComputeFricheInactionCostResult = TResult<
  {
    illegalDumpingCost: number;
    security: number;
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
  constructor(private readonly cityStatsQuery: CityStatsProvider) {}

  async execute({
    siteCityCode,
    siteSurfaceArea,
  }: Request): Promise<ComputeFricheInactionCostResult> {
    try {
      const { surfaceAreaSquareMeters, population, name, accuracy } =
        await this.cityStatsQuery.getCityStats(siteCityCode);
      return success({
        illegalDumpingCost: computeIllegalDumpingDefaultCost(population),
        security: computeSecurityDefaultCost(siteSurfaceArea),
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
