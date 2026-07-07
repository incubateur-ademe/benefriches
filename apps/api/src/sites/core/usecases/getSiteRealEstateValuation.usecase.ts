import { computePropertyTransferDutiesFromSellingPrice } from "shared";
import type { GetSiteRealEstateValuationResponseDto } from "shared";

import { fail, success, type TResult } from "src/shared-kernel/result";
import type { UseCase } from "src/shared-kernel/usecase";
import type { CityStatsProvider } from "src/territory/core/gateways/CityStatsProvider";

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
  private readonly sitesQuery: SitesQuery;
  private readonly cityStatsProvider: CityStatsProvider;
  constructor(sitesQuery: SitesQuery, cityStatsProvider: CityStatsProvider) {
    this.sitesQuery = sitesQuery;
    this.cityStatsProvider = cityStatsProvider;
  }

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
