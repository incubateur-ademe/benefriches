import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";

import { SiteData, UrbanProjectExpressCreationService } from "./UrbanProjectExpressCreationService";

export class MixedUseNeighbourhoodProjectExpressCreationService extends UrbanProjectExpressCreationService {
  constructor(
    dateProvider: IDateProvider,
    reconversionProjectId: string,
    createdBy: string,
    siteData: SiteData,
  ) {
    super(dateProvider, reconversionProjectId, createdBy, siteData);

    this.name = "Quartier mixte";
  }

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: 0.2 * this.siteData.surfaceArea,
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: 0.07 * this.siteData.surfaceArea,
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: 0.02 * this.siteData.surfaceArea,
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: 0.37 * this.siteData.surfaceArea,
      PUBLIC_GREEN_SPACES: 0.19 * this.siteData.surfaceArea,
      PUBLIC_PARKING_LOT: 0.05 * this.siteData.surfaceArea,
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.04 * this.siteData.surfaceArea,
      PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: 0.06 * this.siteData.surfaceArea,
      PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 0,
    };
  }

  override get buildingsFloorAreaDistribution() {
    return {
      RESIDENTIAL: 0.35 * this.siteData.surfaceArea,
      GROUND_FLOOR_RETAIL: 0.03 * this.siteData.surfaceArea,
    };
  }
}
