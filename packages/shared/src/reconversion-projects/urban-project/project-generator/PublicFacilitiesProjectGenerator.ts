import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

export class PublicFacilitiesProjectGenerator extends UrbanProjectGenerator {
  override name = "Équipement public";

  private get buildingsFootprint() {
    return roundTo2Digits(0.41 * this.siteData.surfaceArea);
  }

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [
      {
        surfaceArea: this.buildingsFootprint,
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "BUILDINGS",
      },
      {
        surfaceArea: roundTo2Digits(0.38 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_GREEN_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
      {
        surfaceArea: roundTo2Digits(0.21 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
    ];
  }

  override get buildingsFloorAreaDistribution() {
    return {
      PUBLIC_FACILITIES: this.buildingsFootprint,
    };
  }
}
