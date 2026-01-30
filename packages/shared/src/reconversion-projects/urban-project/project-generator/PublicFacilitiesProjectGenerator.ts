import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * Public Facilities Project Generator
 *
 * Generates a public facilities project (schools, hospitals, etc.) with the following distribution:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %    │ Area     │
 * ├─────────────────────────┼─────────────────────────────┼──────┼──────────┤
 * │ LIVING_AND_ACTIVITY     │ BUILDINGS                   │ 41%  │ 4,100 m² │
 * │ PUBLIC_GREEN_SPACE      │ ARTIFICIAL_GRASS_OR_BUSHES  │ 38%  │ 3,800 m² │
 * │ PUBLIC_SPACE            │ IMPERMEABLE_SOILS           │ 21%  │ 2,100 m² │
 * ├─────────────────────────┴─────────────────────────────┼──────┼──────────┤
 * │ TOTAL                                                 │ 100% │10,000 m² │
 * └───────────────────────────────────────────────────────┴──────┴──────────┘
 *
 * BUILDINGS FLOOR AREA (1 floor):
 * - PUBLIC_FACILITIES: 41% × site area = 4,100 m²
 */

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
