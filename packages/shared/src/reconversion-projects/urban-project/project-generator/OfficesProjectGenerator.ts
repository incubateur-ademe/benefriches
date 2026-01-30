import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * Offices Project Generator
 *
 * Generates a tertiary/office building project with the following distribution:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %    │ Area     │
 * ├─────────────────────────┼─────────────────────────────┼──────┼──────────┤
 * │ LIVING_AND_ACTIVITY     │ BUILDINGS                   │ 80%  │ 8,000 m² │
 * │ LIVING_AND_ACTIVITY     │ IMPERMEABLE_SOILS           │  5%  │   500 m² │
 * │ LIVING_AND_ACTIVITY     │ MINERAL_SOIL                │  5%  │   500 m² │
 * │ LIVING_AND_ACTIVITY     │ ARTIFICIAL_GRASS_OR_BUSHES  │ 10%  │ 1,000 m² │
 * ├─────────────────────────┴─────────────────────────────┼──────┼──────────┤
 * │ TOTAL                                                 │ 100% │10,000 m² │
 * └───────────────────────────────────────────────────────┴──────┴──────────┘
 *
 * BUILDINGS FLOOR AREA (3 floors average):
 * - OFFICES: 80% × site area × 3 floors = 24,000 m²
 */

const AVERAGE_OFFICES_FLOOR_COUNT = 3;

export class OfficesProjectGenerator extends UrbanProjectGenerator {
  override name = "Tertiaire";

  private get buildingsFootprint() {
    return roundTo2Digits(0.8 * this.siteData.surfaceArea);
  }

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [
      {
        surfaceArea: this.buildingsFootprint,
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "BUILDINGS",
      },
      {
        surfaceArea: roundTo2Digits(0.05 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.05 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "MINERAL_SOIL",
      },
      {
        surfaceArea: roundTo2Digits(0.1 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
    ];
  }

  override get buildingsFloorAreaDistribution() {
    const buildingsFloorSurfaceArea = this.buildingsFootprint * AVERAGE_OFFICES_FLOOR_COUNT;
    return {
      OFFICES: roundTo2Digits(buildingsFloorSurfaceArea),
    };
  }
}
