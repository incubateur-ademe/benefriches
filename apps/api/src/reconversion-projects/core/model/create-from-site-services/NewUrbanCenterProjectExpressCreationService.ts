import { roundTo2Digits, typedObjectEntries, DEFAULT_RESALE_RATIO_PER_SQUARE_METERS } from "shared";

import { UrbanProjectExpressCreationService } from "./UrbanProjectExpressCreationService";

const RESALE_RATIO_PER_SQUARE_METERS = {
  ...DEFAULT_RESALE_RATIO_PER_SQUARE_METERS,
  RESIDENTIAL: 220,
};

export class NewUrbanCenterProjectExpressCreationService extends UrbanProjectExpressCreationService {
  override name = "Centralité urbaine";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.2925 * this.siteData.surfaceArea),
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.0325 * this.siteData.surfaceArea),
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.0325 * this.siteData.surfaceArea),
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: roundTo2Digits(0.2925 * this.siteData.surfaceArea),
      PUBLIC_GREEN_SPACES: roundTo2Digits(0.15 * this.siteData.surfaceArea),
      PUBLIC_PARKING_LOT: roundTo2Digits(0.09 * this.siteData.surfaceArea),
      PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.01 * this.siteData.surfaceArea),
      PUBLIC_GRAVEL_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.05 * this.siteData.surfaceArea),
      PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: roundTo2Digits(0.05 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.siteData.surfaceArea * 0.8;
    return {
      RESIDENTIAL: roundTo2Digits(0.62 * buildingsFloorSurfaceArea),
      LOCAL_STORE: roundTo2Digits(0.02 * buildingsFloorSurfaceArea),
      OFFICES: roundTo2Digits(0.04 * buildingsFloorSurfaceArea),
      LOCAL_SERVICES: roundTo2Digits(0.08 * buildingsFloorSurfaceArea),
      ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: roundTo2Digits(
        0.02 * buildingsFloorSurfaceArea,
      ),
      PUBLIC_FACILITIES: roundTo2Digits(0.02 * buildingsFloorSurfaceArea),
    };
  }

  override get siteResaleExpectedSellingPrice() {
    return typedObjectEntries(this.buildingsFloorAreaDistribution).reduce(
      (total, [surfaceName, surfaceArea]) => {
        return total + RESALE_RATIO_PER_SQUARE_METERS[surfaceName] * surfaceArea;
      },
      0,
    );
  }
}
