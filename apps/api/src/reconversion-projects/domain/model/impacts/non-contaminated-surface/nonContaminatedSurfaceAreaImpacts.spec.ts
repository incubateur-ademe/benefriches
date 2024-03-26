import { computeNonContaminatedSurfaceAreaImpact } from "./nonContaminatedSurfaceAreaImpact";

describe("ContaminatedSurfaceArea impact", () => {
  it("returns 1000 for current and forecast impact when no contamination a 1000 square meters site", () => {
    expect(
      computeNonContaminatedSurfaceAreaImpact({
        currentContaminatedSurfaceArea: 0,
        totalSurfaceArea: 1000,
      }),
    ).toEqual({
      current: 1000,
      forecast: 1000,
    });
  });

  it("returns 750 for current and 1000 for forecast impact when 250 square meters of contaminated surface are on a 1000 square meters site", () => {
    expect(
      computeNonContaminatedSurfaceAreaImpact({
        currentContaminatedSurfaceArea: 250,
        totalSurfaceArea: 1000,
      }),
    ).toEqual({
      current: 750,
      forecast: 1000,
    });
  });
});
