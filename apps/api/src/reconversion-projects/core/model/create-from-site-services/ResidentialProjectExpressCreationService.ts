import { roundTo2Digits } from "shared";

import { UrbanProjectExpressCreationService } from "./UrbanProjectExpressCreationService";

export class ResidentialProjectExpressCreationService extends UrbanProjectExpressCreationService {
  override name = "Résidentiel secteur détendu";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.2 * this.siteData.surfaceArea),
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.07 * this.siteData.surfaceArea),
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.02 * this.siteData.surfaceArea),
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: roundTo2Digits(0.37 * this.siteData.surfaceArea),
      PUBLIC_GREEN_SPACES: roundTo2Digits(0.19 * this.siteData.surfaceArea),
      PUBLIC_PARKING_LOT: roundTo2Digits(0.05 * this.siteData.surfaceArea),
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.04 * this.siteData.surfaceArea),
      PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.02 * this.siteData.surfaceArea),
      PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.04 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.siteData.surfaceArea * 0.38;
    return {
      RESIDENTIAL: roundTo2Digits(buildingsFloorSurfaceArea),
    };
  }
}
