import { computePropertyTransferDutiesFromSellingPrice } from "shared";
import type { GetSiteRealEstateValuationResponseDto } from "shared";

import type { CityStatsProvider } from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";

import type { SitesQuery } from "../gateways/SitesQuery";

type Request = {
  siteId: string;
};

type GetSiteRealEstateValuationResult = TResult<
  GetSiteRealEstateValuationResponseDto,
  "SiteNotFound"
>;

export class GetSiteRealEstateValuationUseCase implements UseCase<
  Request,
  GetSiteRealEstateValuationResult
> {
  constructor(
    private readonly sitesQuery: SitesQuery,
    private readonly cityStatsProvider: CityStatsProvider,
  ) {}

  async execute({ siteId }: Request): Promise<GetSiteRealEstateValuationResult> {
    const siteData = await this.sitesQuery.getSiteSurfaceAreaAndCityCode(siteId);

    if (!siteData) {
      return fail("SiteNotFound");
    }

    const cityStats = await this.cityStatsProvider.getCityStats(siteData.cityCode);

    const sellingPrice = siteData.surfaceArea * cityStats.propertyValueMedianPricePerSquareMeters;
    const propertyTransferDuties = computePropertyTransferDutiesFromSellingPrice(sellingPrice);

    return success({
      sellingPrice,
      propertyTransferDuties,
    });
  }
}
