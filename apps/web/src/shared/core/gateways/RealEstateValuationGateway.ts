import type { GetSiteRealEstateValuationResponseDto } from "shared";

export interface RealEstateValuationGateway {
  getEstimatedSiteResalePrice(siteId: string): Promise<GetSiteRealEstateValuationResponseDto>;
}
