import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea } from "../expectedPostDevelopmentResale";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

export class ResidentialTenseAreaProjectGenerator extends UrbanProjectGenerator {
  override name = "Résidentiel secteur tendu";

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [
      {
        surfaceArea: roundTo2Digits(0.42 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "BUILDINGS",
      },
      {
        surfaceArea: roundTo2Digits(0.035 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.035 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "MINERAL_SOIL",
      },
      {
        surfaceArea: roundTo2Digits(0.21 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
      {
        surfaceArea: roundTo2Digits(0.15 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_GREEN_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
      {
        surfaceArea: roundTo2Digits(0.07 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.04 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "MINERAL_SOIL",
      },
      {
        surfaceArea: roundTo2Digits(0.04 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
    ];
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.siteData.surfaceArea;

    return {
      RESIDENTIAL: roundTo2Digits(0.85 * buildingsFloorSurfaceArea),
      LOCAL_STORE: roundTo2Digits(0.04 * buildingsFloorSurfaceArea),
      OFFICES: roundTo2Digits(0.05 * buildingsFloorSurfaceArea),
      LOCAL_SERVICES: roundTo2Digits(0.06 * buildingsFloorSurfaceArea),
    };
  }

  override get siteResaleExpectedSellingPrice() {
    return computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea(
      this.buildingsFloorAreaDistribution,
    );
  }
}
