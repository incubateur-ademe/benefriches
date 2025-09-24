import { getSoilsDistributionForFricheActivity } from "./spaces";

describe("getSoilsDistributionForFricheActivity", () => {
  const surfaceArea = 100000; // 10 hectares

  describe("when built surface area is not specified", () => {
    it("should return equal distribution between prairie grass and cultivation for AGRICULTURE", () => {
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "AGRICULTURE");

      expect(result).toEqual({
        PRAIRIE_GRASS: 50000,
        CULTIVATION: 50000,
      });
    });

    it("should return distribution with buildings, impermeable soils and artificial grass for INDUSTRY", () => {
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "INDUSTRY");

      expect(result).toEqual({
        BUILDINGS: 40000,
        IMPERMEABLE_SOILS: 40000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 20000,
      });
    });

    it("should return mixed distribution for OTHER activity", () => {
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "OTHER");

      expect(result).toEqual({
        BUILDINGS: 30000,
        IMPERMEABLE_SOILS: 20000,
        MINERAL_SOIL: 15000,
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 25000,
        ARTIFICIAL_TREE_FILLED: 10000,
      });
    });
  });

  describe("when built surface area is specified", () => {
    it("should use specified built surface area and adjust other surfaces proportionally for INDUSTRY", () => {
      const builtSurfaceArea = 25000; // 1 hectare instead of default 4 hectares
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "INDUSTRY", {
        builtSurfaceArea,
      });

      // Original non-building area: 60 000 (40 000 + 20 000)
      // Remaining area: 75 000
      // Adjustment factor: 75 000 / 60 000 = 1.25
      expect(result).toEqual({
        BUILDINGS: 25000,
        IMPERMEABLE_SOILS: 50000, // 1.25 * 0.4 * 100000
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 25000, // 1.25 * 0.2 * 100000
      });
    });

    it("should handle zero built area for INDUSTRY", () => {
      const builtSurfaceArea = 0;
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "INDUSTRY", {
        builtSurfaceArea,
      });

      // Original non-building area: 60 000
      // Remaining area: 100 000
      // Adjustment factor: 100 000 / 60 000 = 1.666... (5/3)
      expect(result).toEqual({
        IMPERMEABLE_SOILS: 66666.66666666667, // 40000 * (5/3)
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 33333.333333333336, // 20000 * (5/3)
      });
    });

    it("should work with activities that originally have no buildings like AGRICULTURE", () => {
      const builtSurfaceArea = 30000;
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "AGRICULTURE", {
        builtSurfaceArea,
      });

      // Original non-building area: 100 000 (no buildings originally)
      // Remaining area: 70 000
      // Adjustment factor: 70 000 / 100 000 = 0.7
      expect(result).toEqual({
        BUILDINGS: 30000,
        PRAIRIE_GRASS: 35000, // 50000 * 0.7
        CULTIVATION: 35000, // 50000 * 0.7
      });
    });

    it("should distribute remaining area correctly for OTHER activity", () => {
      const builtSurfaceArea = 30000;
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "OTHER", {
        builtSurfaceArea,
      });

      // Original non-building area: 70000 (20000 + 15000 + 25000 + 10000)
      // Remaining area: 70000
      // Adjustment factor: 70000 / 70000 = 1
      expect(result).toEqual({
        BUILDINGS: 30000,
        IMPERMEABLE_SOILS: 20000, // 20000 * 1
        MINERAL_SOIL: 15000, // 15000 * 1
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 25000, // 25000 * 1
        ARTIFICIAL_TREE_FILLED: 10000, // 10000 * 1
      });
    });

    it("should only allocate built surface area when equal to total surface area", () => {
      const builtSurfaceArea = surfaceArea;
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "INDUSTRY", {
        builtSurfaceArea,
      });

      expect(result).toEqual({
        BUILDINGS: 100000,
      });
    });

    it("should use total surface area as built surface area when passed value is greater than total surface area", () => {
      const builtSurfaceArea = surfaceArea + 1;
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "INDUSTRY", {
        builtSurfaceArea,
      });

      // Should be clamped to total surface area
      expect(result).toEqual({
        BUILDINGS: 100000,
      });
    });
  });

  describe("activities with originally no buildings", () => {
    it("should handle TIP_OR_RECYCLING_SITE with specified built area", () => {
      const builtSurfaceArea = 15000;
      const result = getSoilsDistributionForFricheActivity(surfaceArea, "TIP_OR_RECYCLING_SITE", {
        builtSurfaceArea,
      });

      // Original non-building area: 100000 (no buildings originally)
      // Remaining area: 90 000
      // Adjustment factor: 90 000 / 100 000 = 0.9
      expect(result).toEqual({
        BUILDINGS: 15000,
        IMPERMEABLE_SOILS: 38250, // 45 000 * 0.9
        MINERAL_SOIL: 4250, // 5 000 * 0.9
        ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 42500, // 50 000 * 0.9
      });
    });
  });

  describe("edge cases", () => {
    it("should handle zero total surface area", () => {
      const result = getSoilsDistributionForFricheActivity(0, "INDUSTRY", { builtSurfaceArea: 0 });

      expect(result).toEqual({});
    });
  });
});
