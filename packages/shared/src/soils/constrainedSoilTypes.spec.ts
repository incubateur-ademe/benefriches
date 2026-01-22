import { describe, it, expect } from "vitest";

import { isConstrainedSoilType, CONSTRAINED_SOIL_TYPES } from "./index";

describe("isConstrainedSoilType", () => {
  it("should return true for all 12 constrained soil types", () => {
    // These soil types cannot be created by urban development
    // They can only exist if they already exist on the site
    const constrainedSoils = [
      "PRAIRIE_GRASS",
      "PRAIRIE_BUSHES",
      "PRAIRIE_TREES",
      "FOREST_DECIDUOUS",
      "FOREST_CONIFER",
      "FOREST_POPLAR",
      "FOREST_MIXED",
      "CULTIVATION",
      "VINEYARD",
      "ORCHARD",
      "WET_LAND",
      "WATER",
    ] as const;

    for (const soil of constrainedSoils) {
      expect(isConstrainedSoilType(soil)).toBe(true);
    }

    // Also verify CONSTRAINED_SOIL_TYPES array has exactly these 12 values
    expect(CONSTRAINED_SOIL_TYPES).toHaveLength(12);
    for (const soil of constrainedSoils) {
      expect(CONSTRAINED_SOIL_TYPES).toContain(soil);
    }
  });

  it("should return false for non-constrained soil types", () => {
    // These soil types CAN be created by urban development
    const nonConstrainedSoils = [
      "BUILDINGS",
      "IMPERMEABLE_SOILS",
      "MINERAL_SOIL",
      "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
      "ARTIFICIAL_TREE_FILLED",
    ] as const;

    for (const soil of nonConstrainedSoils) {
      expect(isConstrainedSoilType(soil)).toBe(false);
    }
  });
});
