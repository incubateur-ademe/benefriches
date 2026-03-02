import { InMemoryCityStatsQuery } from "src/reconversion-projects/adapters/secondary/queries/city-stats/InMemoryCityStatsQuery";
import { FailureResult, SuccessResult } from "src/shared-kernel/result";
import { InMemorySitesQuery } from "src/sites/adapters/secondary/site-query/InMemorySitesQuery";

import { GetSiteRealEstateValuationUseCase } from "./getSiteRealEstateValuation.usecase";

describe("GetSiteRealEstateValuationUseCase", () => {
  it("should return correct valuation when site exists", async () => {
    const sitesQuery = new InMemorySitesQuery();
    const cityStatsQuery = new InMemoryCityStatsQuery();

    const siteId = "site-123";
    sitesQuery._setSiteSurfaceAreaAndCityCode(siteId, {
      surfaceArea: 1000,
      cityCode: "75056", // Paris - has landValueMedianPricePerSquareMeters of 500 in InMemory
    });

    const useCase = new GetSiteRealEstateValuationUseCase(sitesQuery, cityStatsQuery);
    const result = await useCase.execute({ siteId });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult<unknown>).getData()).toEqual({
      sellingPrice: 500_000, // 1000 * 500
      propertyTransferDuties: 29_050, // 500_000 * 0.0581 (TRANSFER_TAX_PERCENT_PER_TRANSACTION)
    });
  });

  it("should return SiteNotFound when site does not exist", async () => {
    const sitesQuery = new InMemorySitesQuery();
    const cityStatsQuery = new InMemoryCityStatsQuery();

    const useCase = new GetSiteRealEstateValuationUseCase(sitesQuery, cityStatsQuery);
    const result = await useCase.execute({ siteId: "nonexistent" });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult).getError()).toBe("SiteNotFound");
  });

  it("should return ValuationDataNotAvailable when land price data is missing", async () => {
    const sitesQuery = new InMemorySitesQuery();
    const cityStatsQuery = new InMemoryCityStatsQuery();

    const siteId = "site-456";
    sitesQuery._setSiteSurfaceAreaAndCityCode(siteId, {
      surfaceArea: 1000,
      cityCode: "38375", // Saint-Christophe-en-Oisans - has no landValueMedianPricePerSquareMeters
    });

    const useCase = new GetSiteRealEstateValuationUseCase(sitesQuery, cityStatsQuery);
    const result = await useCase.execute({ siteId });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult).getError()).toBe("ValuationDataNotAvailable");
  });
});
