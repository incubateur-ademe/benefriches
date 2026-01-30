import { ReconversionProjectSoilsDistribution } from "../../reconversionProjectSchemas";
import { UrbanProjectGenerator } from "./UrbanProjectGenerator";

/**
 * Renaturation Project Generator
 *
 * Generates a renaturation project converting the entire site to green space:
 *
 * SOILS DISTRIBUTION (example for 10,000 m² site):
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ Space Category          │ Soil Type                   │ %    │ Area     │
 * ├─────────────────────────┼─────────────────────────────┼──────┼──────────┤
 * │ PUBLIC_GREEN_SPACE      │ ARTIFICIAL_GRASS_OR_BUSHES  │ 100% │10,000 m² │
 * ├─────────────────────────┴─────────────────────────────┼──────┼──────────┤
 * │ TOTAL                                                 │ 100% │10,000 m² │
 * └───────────────────────────────────────────────────────┴──────┴──────────┘
 *
 * BUILDINGS FLOOR AREA: None (no buildings)
 */

export class RenaturationProjectGenerator extends UrbanProjectGenerator {
  override name = "Renaturation";

  override get projectSoilsDistribution(): ReconversionProjectSoilsDistribution {
    return [
      {
        surfaceArea: this.siteData.surfaceArea,
        spaceCategory: "PUBLIC_GREEN_SPACE",
        soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      },
    ];
  }
}
