import { roundTo2Digits } from "../../../services";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

export class OfficesProjectGenerator extends UrbanProjectGenerator {
  override name = "Tertiaire";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.8 * this.siteData.surfaceArea),
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.05 * this.siteData.surfaceArea),
      PRIVATE_GRAVEL_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.05 * this.siteData.surfaceArea),
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: roundTo2Digits(0.1 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.spacesDistribution.BUILDINGS_FOOTPRINT * 3;
    return {
      OFFICES: roundTo2Digits(buildingsFloorSurfaceArea),
    };
  }
}
