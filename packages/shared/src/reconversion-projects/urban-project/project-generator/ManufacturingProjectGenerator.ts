import { roundTo2Digits } from "../../../services";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

export class ManufacturingProjectGenerator extends UrbanProjectGenerator {
  override name = "Industrie";

  override get spacesDistribution() {
    return {
      BUILDINGS_FOOTPRINT: roundTo2Digits(0.6 * this.siteData.surfaceArea),
      PRIVATE_PAVED_ALLEY_OR_PARKING_LOT: roundTo2Digits(0.3 * this.siteData.surfaceArea),
      PRIVATE_GARDEN_AND_GRASS_ALLEYS: roundTo2Digits(0.1 * this.siteData.surfaceArea),
    };
  }

  override get buildingsFloorAreaDistribution() {
    return {
      ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: roundTo2Digits(
        this.spacesDistribution.BUILDINGS_FOOTPRINT,
      ),
    };
  }
}
