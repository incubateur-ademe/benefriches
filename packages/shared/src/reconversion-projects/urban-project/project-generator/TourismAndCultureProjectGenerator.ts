import { roundTo2Digits } from "../../../services";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

export class TourismAndCultureProjectGenerator extends UrbanProjectGenerator {
  override name = "Centre culturel";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.6 * this.siteData.surfaceArea),
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.2 * this.siteData.surfaceArea),
      PUBLIC_GREEN_SPACES: roundTo2Digits(0.2 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    return {
      CULTURAL_PLACE: roundTo2Digits(this.spacesDistribution.BUILDINGS_FOOTPRINT),
    };
  }
}
