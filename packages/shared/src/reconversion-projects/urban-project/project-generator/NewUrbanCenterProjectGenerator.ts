import { typedObjectEntries } from "../../../object-entries";
import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { DEFAULT_RESALE_RATIO_PER_SQUARE_METERS } from "../expectedPostDevelopmentResale";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

const RESALE_RATIO_PER_SQUARE_METERS = {
  ...DEFAULT_RESALE_RATIO_PER_SQUARE_METERS,
  RESIDENTIAL: 220,
};

export class NewUrbanCenterProjectGenerator extends UrbanProjectGenerator {
  override name = "Centralité urbaine";

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [
      {
        surfaceArea: roundTo2Digits(0.2925 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "BUILDINGS",
      },
      {
        surfaceArea: roundTo2Digits(0.0325 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.0325 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "MINERAL_SOIL",
      },
      {
        surfaceArea: roundTo2Digits(0.2925 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
      {
        surfaceArea: roundTo2Digits(0.15 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_GREEN_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
      {
        surfaceArea: roundTo2Digits(0.1 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.05 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "MINERAL_SOIL",
      },
      {
        surfaceArea: roundTo2Digits(0.05 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
    ];
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
