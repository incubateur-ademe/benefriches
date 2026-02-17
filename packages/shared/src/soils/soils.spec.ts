import { describe, expect, it } from "vitest";

import { isNaturalSoil } from ".";

describe("isNaturalSoil", () => {
  it.each(["FOREST_DECIDUOUS", "FOREST_CONIFER", "FOREST_POPLAR", "FOREST_MIXED"] as const)(
    "returns true for forest soil %s",
    (soilType) => {
      expect(isNaturalSoil(soilType)).toBe(true);
    },
  );

  it.each(["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"] as const)(
    "returns true for prairie soil %s",
    (soilType) => {
      expect(isNaturalSoil(soilType)).toBe(true);
    },
  );

  it("returns true for WET_LAND", () => {
    expect(isNaturalSoil("WET_LAND")).toBe(true);
  });

  it("returns true for WATER", () => {
    expect(isNaturalSoil("WATER")).toBe(true);
  });

  it.each([
    "BUILDINGS",
    "IMPERMEABLE_SOILS",
    "MINERAL_SOIL",
    "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    "ARTIFICIAL_TREE_FILLED",
    "CULTIVATION",
    "VINEYARD",
    "ORCHARD",
  ] as const)("returns false for non-natural soil %s", (soilType) => {
    expect(isNaturalSoil(soilType)).toBe(false);
  });
});
