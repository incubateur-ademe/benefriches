import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { isNaturalSoil } from "./index.js";

describe("isNaturalSoil", () => {
  const forestSoils = [
    "FOREST_DECIDUOUS",
    "FOREST_CONIFER",
    "FOREST_POPLAR",
    "FOREST_MIXED",
  ] as const;
  for (const soilType of forestSoils) {
    it(`returns true for forest soil ${soilType}`, () => {
      assert.strictEqual(isNaturalSoil(soilType), true);
    });
  }

  const prairieSoils = ["PRAIRIE_GRASS", "PRAIRIE_BUSHES", "PRAIRIE_TREES"] as const;
  for (const soilType of prairieSoils) {
    it(`returns true for prairie soil ${soilType}`, () => {
      assert.strictEqual(isNaturalSoil(soilType), true);
    });
  }

  it("returns true for WET_LAND", () => {
    assert.strictEqual(isNaturalSoil("WET_LAND"), true);
  });

  it("returns true for WATER", () => {
    assert.strictEqual(isNaturalSoil("WATER"), true);
  });

  const nonNaturalSoils = [
    "BUILDINGS",
    "IMPERMEABLE_SOILS",
    "MINERAL_SOIL",
    "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
    "ARTIFICIAL_TREE_FILLED",
    "CULTIVATION",
    "VINEYARD",
    "ORCHARD",
  ] as const;
  for (const soilType of nonNaturalSoils) {
    it(`returns false for non-natural soil ${soilType}`, () => {
      assert.strictEqual(isNaturalSoil(soilType), false);
    });
  }
});
