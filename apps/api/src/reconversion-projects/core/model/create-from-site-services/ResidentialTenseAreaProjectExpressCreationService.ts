import {
  computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea,
  roundTo2Digits,
} from "shared";

import { UrbanProjectExpressCreationService } from "./UrbanProjectExpressCreationService";

export class ResidentialTenseAreaProjectExpressCreationService extends UrbanProjectExpressCreationService {
  override name = "Résidentiel zone tendue";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.42 * this.siteData.surfaceArea),
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.035 * this.siteData.surfaceArea),
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.035 * this.siteData.surfaceArea),
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: roundTo2Digits(0.21 * this.siteData.surfaceArea),
      PUBLIC_GREEN_SPACES: roundTo2Digits(0.15 * this.siteData.surfaceArea),
      PUBLIC_PARKING_LOT: roundTo2Digits(0.05 * this.siteData.surfaceArea),
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.02 * this.siteData.surfaceArea),
      PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.04 * this.siteData.surfaceArea),
      PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.04 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.siteData.surfaceArea;

    return {
      RESIDENTIAL: roundTo2Digits(0.85 * buildingsFloorSurfaceArea),
      GROUND_FLOOR_RETAIL: roundTo2Digits(0.04 * buildingsFloorSurfaceArea),
      TERTIARY_ACTIVITIES: roundTo2Digits(0.05 * buildingsFloorSurfaceArea),
      NEIGHBOURHOOD_FACILITIES_AND_SERVICES: roundTo2Digits(0.06 * buildingsFloorSurfaceArea),
    };
  }

  override get siteResaleExpectedSellingPrice() {
    return computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea(
      this.buildingsFloorAreaDistribution,
    );
  }
}