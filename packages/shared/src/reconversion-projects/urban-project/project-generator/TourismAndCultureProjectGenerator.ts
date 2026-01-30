import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * Tourism and Culture Project Generator
 *
 * Generates a cultural center project with the following distribution:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %    │ Area     │
 * ├─────────────────────────┼─────────────────────────────┼──────┼──────────┤
 * │ LIVING_AND_ACTIVITY     │ BUILDINGS                   │ 60%  │ 6,000 m² │
 * │ LIVING_AND_ACTIVITY     │ IMPERMEABLE_SOILS           │ 20%  │ 2,000 m² │
 * │ PUBLIC_GREEN_SPACE      │ ARTIFICIAL_GRASS_OR_BUSHES  │ 20%  │ 2,000 m² │
 * ├─────────────────────────┴─────────────────────────────┼──────┼──────────┤
 * │ TOTAL                                                 │ 100% │10,000 m² │
 * └───────────────────────────────────────────────────────┴──────┴──────────┘
 *
 * BUILDINGS FLOOR AREA (1 floor):
 * - CULTURAL_PLACE: 60% × site area = 6,000 m²
 */

export class TourismAndCultureProjectGenerator extends UrbanProjectGenerator {
  override name = "Centre culturel";

  private get buildingsFootprint() {
    return roundTo2Digits(0.6 * this.siteData.surfaceArea);
  }

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [
      {
        surfaceArea: this.buildingsFootprint,
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "BUILDINGS",
      },
      {
        surfaceArea: roundTo2Digits(0.2 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.2 * this.siteData.surfaceArea),
        spaceCategory: "PUBLIC_GREEN_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
    ];
  }

  override get buildingsFloorAreaDistribution() {
    return {
      CULTURAL_PLACE: this.buildingsFootprint,
    };
  }
}
