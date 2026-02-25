import type { RealEstateValuationGateway } from "@/shared/core/gateways/RealEstateValuationGateway";

export class DisabledRealEstateValuationService implements RealEstateValuationGateway {
  async getEstimatedSiteResalePrice(): Promise<never> {
    throw new Error("Real estate valuation data is currently unavailable");
  }
}
