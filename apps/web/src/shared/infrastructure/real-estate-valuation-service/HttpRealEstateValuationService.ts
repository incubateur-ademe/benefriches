import type { GetSiteRealEstateValuationResponseDto } from "shared";

import type { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";

export class HttpRealEstateValuationService implements RealEstateValuationGateway {
  async getEstimatedSiteResalePrice(
    siteId: string,
  ): Promise<GetSiteRealEstateValuationResponseDto> {
    const response = await fetch(`/api/sites/${siteId}/real-estate-valuation`);
    if (!response.ok) {
      throw new Error(`Error while fetching real estate valuation for site ${siteId}`);
    }
    return response.json() as Promise<GetSiteRealEstateValuationResponseDto>;
  }
}
