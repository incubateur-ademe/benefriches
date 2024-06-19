import { SiteFeaturesGateway } from "../../application/fetchSiteFeatures.action";
import { SiteFeatures } from "../../domain/siteFeatures";

export class MockSiteFeaturesService implements SiteFeaturesGateway {
  siteFeatures: SiteFeatures = {
    id: "189038dd-3a6a-43af-bc8d-c4999d8d82cc",
    name: "Mocked site name",
    address: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
    isFriche: true,
    expenses: [
      { amount: 15432, purpose: "maintenance" },
      { amount: 10300, purpose: "security" },
      { amount: 340, purpose: "illegalDumpingCost" },
    ],
    surfaceArea: 120000,
    ownerName: "ADEME",
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 43000,
      MINERAL_SOIL: 45000,
      BUILDINGS: 1000,
      IMPERMEABLE_SOILS: 31000,
    },
  };

  setSiteFeatures(siteFeatures: SiteFeatures): void {
    this.siteFeatures = siteFeatures;
  }

  async getSiteFeatures(): Promise<SiteFeatures> {
    return Promise.resolve(this.siteFeatures);
  }
}
