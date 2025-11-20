import { SiteGateway } from "../../core/fetchSiteFeatures.action";
import { SiteFeatures, SiteView } from "../../core/site.types";

export class InMemorySiteService implements SiteGateway {
  siteFeatures: SiteFeatures = {
    id: "189038dd-3a6a-43af-bc8d-c4999d8d82cc",
    name: "Mocked site name",
    address: "155 bis Av. Pierre Brossolette, 92120 Montrouge",
    nature: "FRICHE",
    isExpressSite: false,
    accidents: {
      accidentsDeaths: 0,
      minorInjuries: 0,
      severyInjuries: 0,
    },
    expenses: [
      { amount: 15432, purpose: "maintenance" },
      { amount: 10300, purpose: "security" },
      { amount: 340, purpose: "illegalDumpingCost" },
    ],
    incomes: [],
    surfaceArea: 120000,
    ownerName: "ADEME",
    soilsDistribution: {
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 43000,
      MINERAL_SOIL: 45000,
      BUILDINGS: 1000,
      IMPERMEABLE_SOILS: 31000,
    },
  };

  siteView: SiteView = {
    id: "189038dd-3a6a-43af-bc8d-c4999d8d82cc",
    features: this.siteFeatures,
    reconversionProjects: [],
  };

  setSiteFeatures(siteFeatures: SiteFeatures): void {
    this.siteFeatures = siteFeatures;
  }

  setSiteView(siteView: SiteView): void {
    this.siteView = siteView;
  }

  async getSiteFeatures(): Promise<SiteFeatures> {
    return Promise.resolve(this.siteFeatures);
  }

  async getSiteView(): Promise<SiteView> {
    return Promise.resolve(this.siteView);
  }
}
