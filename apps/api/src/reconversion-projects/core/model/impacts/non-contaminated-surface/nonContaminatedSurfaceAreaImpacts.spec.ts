import { computeNonContaminatedSurfaceAreaImpact } from "./nonContaminatedSurfaceAreaImpact";

describe("ContaminatedSurfaceArea impact", () => {
  it("returns 1000 for current and forecast impact when no contamination a 1000 square meters site", () => {
    expect(
      computeNonContaminatedSurfaceAreaImpact({
        currentContaminatedSurfaceArea: 0,
        forecastDecontaminedSurfaceArea: 0,
        totalSurfaceArea: 1000,
      }),
    ).toEqual({
      current: 1000,
      forecast: 1000,
      difference: 0,
    });
  });

  it("returns 750 for current and 1000 for forecast impact when 250 square meters of contaminated surface are on a 1000 square meters site", () => {
    expect(
      computeNonContaminatedSurfaceAreaImpact({
        currentContaminatedSurfaceArea: 250,
        forecastDecontaminedSurfaceArea: 250,
        totalSurfaceArea: 1000,
      }),
    ).toEqual({
      current: 750,
      forecast: 1000,
      difference: 250,
    });
  });

  it("returns 750 for current and 850 for forecast impact when 100 m² will be decontaminated", () => {
    expect(
      computeNonContaminatedSurfaceAreaImpact({
        currentContaminatedSurfaceArea: 250,
        forecastDecontaminedSurfaceArea: 100,
        totalSurfaceArea: 1000,
      }),
    ).toEqual({
      current: 750,
      forecast: 850,
      difference: 100,
    });
  });
});
