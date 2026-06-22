import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { computeSoilsCo2eqStorageImpact } from "./soilsCo2eqStorage";

describe("computeSoilsCarbonStorage", () => {
  it("returns positive impact difference", () => {
    assert.deepStrictEqual(computeSoilsCo2eqStorageImpact(10, 20), {
      base: 36.67,
      forecast: 73.33,
      difference: 36.66,
    });
  });
  it("returns negative impact difference if soils are artificialized", () => {
    assert.deepStrictEqual(computeSoilsCo2eqStorageImpact(632, 9.5), {
      base: 2317.33,
      forecast: 34.83,
      difference: -2282.5,
    });
  });
});
