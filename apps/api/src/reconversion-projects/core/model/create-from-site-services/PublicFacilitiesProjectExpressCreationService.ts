import { roundTo2Digits } from "shared";

import { UrbanProjectExpressCreationService } from "./UrbanProjectExpressCreationService";

export class PublicFacilitiesProjectExpressCreationService extends UrbanProjectExpressCreationService {
  override name = "Équipements publics";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.41 * this.siteData.surfaceArea),
      PUBLIC_GREEN_SPACES: roundTo2Digits(0.38 * this.siteData.surfaceArea),
      PUBLIC_PARKING_LOT: roundTo2Digits(0.1 * this.siteData.surfaceArea),
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.11 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.siteData.surfaceArea * 0.2;
    return {
      PUBLIC_FACILITIES: roundTo2Digits(buildingsFloorSurfaceArea),
    };
  }
}
