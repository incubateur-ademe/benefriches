import { GetCityReferenceDataResponseDto } from "shared";

import { success } from "src/shared-kernel/result";
import type { TResult } from "src/shared-kernel/result";
import { UseCase } from "src/shared-kernel/usecase";

import { CityImpactsDataProvider } from "../gateways/CityImpactsDataProvider";

type Request = {
  cityCode: string;
};

export class GetCityReferenceDataUseCase implements UseCase<
  Request,
  TResult<GetCityReferenceDataResponseDto>
> {
  private readonly cityReferenceDataQuery: CityImpactsDataProvider;
  constructor(cityReferenceDataQuery: CityImpactsDataProvider) {
    this.cityReferenceDataQuery = cityReferenceDataQuery;
  }

  async execute({ cityCode }: Request): Promise<TResult<GetCityReferenceDataResponseDto>> {
    const { stats, isRural } = await this.cityReferenceDataQuery.getCityDataAndStats(cityCode);

    return success({
      cityCode,
      population: stats.population,
      isRural,
      landAndRealEstateValues: {
        landWithoutBuildingsMedianPricePerSquareMeters:
          stats.landWithoutBuildingsMedianPricePerSquareMeters,
        propertyValueMedianPricePerSquareMeters: stats.propertyValueMedianPricePerSquareMeters,
        accuracy: stats.accuracy,
      },
    });
  }
}
