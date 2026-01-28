import {
  getSiteRealEstateValuationResponseDtoSchema,
  type GetSiteRealEstateValuationResponseDto,
} from "shared";

import type { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";

export class HttpRealEstateValuationService implements RealEstateValuationGateway {
  async getEstimatedSiteResalePrice(
    siteId: string,
  ): Promise<GetSiteRealEstateValuationResponseDto> {
    const response = await fetch(`/api/sites/${siteId}/real-estate-valuation`);
    if (!response.ok) {
      throw new Error(`Error while fetching real estate valuation for site ${siteId}`);
    }

    const jsonResponse: unknown = await response.json();
    const result = getSiteRealEstateValuationResponseDtoSchema.safeParse(jsonResponse);

    if (!result.success) {
      throw new Error("HttpRealEstateValuationService: Invalid response format");
    }

    return result.data;
  }
}
