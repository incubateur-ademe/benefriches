import { typedObjectEntries } from "../../../object-entries";
import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { DEFAULT_RESALE_RATIO_PER_SQUARE_METERS } from "../expectedPostDevelopmentResale";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * New Urban Center Project Generator
 *
 * Generates a mixed-use urban center project with the following distribution:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %      │ Area       │
 * ├─────────────────────────┼─────────────────────────────┼────────┼────────────┤
 * │ LIVING_AND_ACTIVITY     │ BUILDINGS                   │ 29.25% │  2,925 m²  │
 * │ LIVING_AND_ACTIVITY     │ IMPERMEABLE_SOILS           │  3.25% │    325 m²  │
 * │ LIVING_AND_ACTIVITY     │ MINERAL_SOIL                │  3.25% │    325 m²  │
 * │ LIVING_AND_ACTIVITY     │ ARTIFICIAL_GRASS_OR_BUSHES  │ 29.25% │  2,925 m²  │
 * │ PUBLIC_GREEN_SPACE      │ ARTIFICIAL_GRASS_OR_BUSHES  │ 15%    │  1,500 m²  │
 * │ PUBLIC_SPACE            │ IMPERMEABLE_SOILS           │ 10%    │  1,000 m²  │
 * │ PUBLIC_SPACE            │ MINERAL_SOIL                │  5%    │    500 m²  │
 * │ PUBLIC_SPACE            │ ARTIFICIAL_GRASS_OR_BUSHES  │  5%    │    500 m²  │
 * ├─────────────────────────┴─────────────────────────────┼────────┼────────────┤
 * │ TOTAL                                                 │ 100%   │ 10,000 m²  │
 * └───────────────────────────────────────────────────────┴────────┴────────────┘
 *
 * BUILDINGS FLOOR AREA (80% of site area = 8,000 m²):
 * - RESIDENTIAL:          62% × 8,000 = 4,960 m²
 * - LOCAL_STORE:           2% × 8,000 =   160 m²
 * - OFFICES:               4% × 8,000 =   320 m²
 * - LOCAL_SERVICES:        8% × 8,000 =   640 m²
 * - ARTISANAL/INDUSTRIAL:  2% × 8,000 =   160 m²
 * - PUBLIC_FACILITIES:     2% × 8,000 =   160 m²
 */

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
