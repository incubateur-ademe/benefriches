import { roundTo2Digits } from "../../../services";
import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * Manufacturing Project Generator
 *
 * Generates an industrial/manufacturing project with the following distribution:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %    │ Area     │
 * ├─────────────────────────┼─────────────────────────────┼──────┼──────────┤
 * │ LIVING_AND_ACTIVITY     │ BUILDINGS                   │ 60%  │ 6,000 m² │
 * │ LIVING_AND_ACTIVITY     │ IMPERMEABLE_SOILS           │ 30%  │ 3,000 m² │
 * │ LIVING_AND_ACTIVITY     │ ARTIFICIAL_GRASS_OR_BUSHES  │ 10%  │ 1,000 m² │
 * ├─────────────────────────┴─────────────────────────────┼──────┼──────────┤
 * │ TOTAL                                                 │ 100% │10,000 m² │
 * └───────────────────────────────────────────────────────┴──────┴──────────┘
 *
 * BUILDINGS FLOOR AREA (1 floor):
 * - ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 60% × site area = 6,000 m²
 */

export class ManufacturingProjectGenerator extends UrbanProjectGenerator {
  override name = "Industrie";

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
        surfaceArea: roundTo2Digits(0.3 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "IMPERMEABLE_SOILS",
      },
      {
        surfaceArea: roundTo2Digits(0.1 * this.siteData.surfaceArea),
        spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
    ];
  }

  override get buildingsFloorAreaDistribution() {
    return {
      ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: this.buildingsFootprint,
    };
  }
}
