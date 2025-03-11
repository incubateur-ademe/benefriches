import { computeSoilsCo2eqStorageImpact } from "./soilsCo2eqStorage";

describe("computeSoilsCarbonStorage", () => {
  it("returns positive impact difference", () => {
    expect(computeSoilsCo2eqStorageImpact(10, 20)).toEqual({
      base: 36.67,
      forecast: 73.33,
      difference: 36.66,
    });
  });
  it("returns negative impact difference if soils are artificialized", () => {
    expect(computeSoilsCo2eqStorageImpact(632, 9.5)).toEqual({
      base: 2317.33,
      forecast: 34.83,
      difference: -2282.5,
    });
  });
});
