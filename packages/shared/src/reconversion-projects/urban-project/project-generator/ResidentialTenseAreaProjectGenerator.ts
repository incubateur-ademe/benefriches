import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { computeExpectedPostDevelopmentResaleSellingPriceFromSurfacesInTenseArea } from "../expectedPostDevelopmentResale";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * Residential Tense Area Project Generator
 *
 * Generates a residential project for tense housing markets (higher density) with the following distribution:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %    │ Area     │
 * ├─────────────────────────┼─────────────────────────────┼──────┼──────────┤
 * │ LIVING_AND_ACTIVITY     │ BUILDINGS                   │ 42%  │ 4,200 m² │
 * │ LIVING_AND_ACTIVITY     │ IMPERMEABLE_SOILS           │ 3.5% │   350 m² │
 * │ LIVING_AND_ACTIVITY     │ MINERAL_SOIL                │ 3.5% │   350 m² │
 * │ LIVING_AND_ACTIVITY     │ ARTIFICIAL_GRASS_OR_BUSHES  │ 21%  │ 2,100 m² │
 * │ PUBLIC_GREEN_SPACE      │ ARTIFICIAL_GRASS_OR_BUSHES  │ 15%  │ 1,500 m² │
 * │ PUBLIC_SPACE            │ IMPERMEABLE_SOILS           │  7%  │   700 m² │
 * │ PUBLIC_SPACE            │ MINERAL_SOIL                │  4%  │   400 m² │
 * │ PUBLIC_SPACE            │ ARTIFICIAL_GRASS_OR_BUSHES  │  4%  │   400 m² │
 * ├─────────────────────────┴─────────────────────────────┼──────┼──────────┤
 * │ TOTAL                                                 │ 100% │10,000 m² │
 * └───────────────────────────────────────────────────────┴──────┴──────────┘
 *
 * BUILDINGS FLOOR AREA (100% of site area = 10,000 m²):
 * - RESIDENTIAL:     85% × 10,000 = 8,500 m²
 * - LOCAL_STORE:      4% × 10,000 =   400 m²
 * - OFFICES:          5% × 10,000 =   500 m²
 * - LOCAL_SERVICES:   6% × 10,000 =   600 m²
 */

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
