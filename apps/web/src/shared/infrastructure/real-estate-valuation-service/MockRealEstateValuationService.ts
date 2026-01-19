import type { GetSiteRealEstateValuationResponseDto } from "shared";

import type { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";

const DEFAULT_SELLING_PRICE = 1500000;
const DEFAULT_PROPERTY_TRANSFER_DUTIES = 120000;

export class MockRealEstateValuationService implements RealEstateValuationGateway {
  async getEstimatedSiteResalePrice(
    _siteId: string,
  ): Promise<GetSiteRealEstateValuationResponseDto> {
    return Promise.resolve({
      sellingPrice: DEFAULT_SELLING_PRICE,
      propertyTransferDuties: DEFAULT_PROPERTY_TRANSFER_DUTIES,
    });
  }
}
