import { type ReconversionProjectSoilsDistribution } from "shared";

import { sortAndAggregateProjectSoilDistribution } from "./soils";

describe("sortAndAggregateProjectSoilDistribution", () => {
  it("should return soil types sorted by ORDERED_SOIL_TYPES order", () => {
    const distribution: ReconversionProjectSoilsDistribution = [
      { soilType: "WATER", surfaceArea: 100 },
      { soilType: "BUILDINGS", surfaceArea: 200 },
    ];
    const result = sortAndAggregateProjectSoilDistribution(distribution);
    expect(result[0]?.soilType).toBe("BUILDINGS");
    expect(result[1]?.soilType).toBe("WATER");
  });

  it("should aggregate surface areas for duplicate soil types", () => {
    const distribution: ReconversionProjectSoilsDistribution = [
      { soilType: "BUILDINGS", surfaceArea: 100 },
      { soilType: "BUILDINGS", surfaceArea: 200 },
    ];
    const result = sortAndAggregateProjectSoilDistribution(distribution);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ soilType: "BUILDINGS", surfaceArea: 300 });
  });

  it("should return empty array for empty distribution", () => {
    expect(sortAndAggregateProjectSoilDistribution([])).toEqual([]);
  });
});
