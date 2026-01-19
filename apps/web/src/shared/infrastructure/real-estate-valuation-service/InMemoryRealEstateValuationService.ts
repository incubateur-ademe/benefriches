import type { GetSiteRealEstateValuationResponseDto } from "shared";

import type { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";

export class InMemoryRealEstateValuationService implements RealEstateValuationGateway {
  private valuations = new Map<string, GetSiteRealEstateValuationResponseDto>();

  // Default fallback values for tests that don't configure specific sites
  private defaultSellingPrice = 1500000;
  private defaultPropertyTransferDuties = 120000;

  async getEstimatedSiteResalePrice(
    siteId: string,
  ): Promise<GetSiteRealEstateValuationResponseDto> {
    const valuation = this.valuations.get(siteId);
    if (valuation) return valuation;
    return {
      sellingPrice: this.defaultSellingPrice,
      propertyTransferDuties: this.defaultPropertyTransferDuties,
    };
  }

  // Test helpers
  _setValuation(siteId: string, valuation: GetSiteRealEstateValuationResponseDto): void {
    this.valuations.set(siteId, valuation);
  }

  _setDefaultValuation(sellingPrice: number, propertyTransferDuties: number): void {
    this.defaultSellingPrice = sellingPrice;
    this.defaultPropertyTransferDuties = propertyTransferDuties;
  }
}
