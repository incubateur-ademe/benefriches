import { getNonContaminatedSurfaceAreaImpact } from "./nonContaminatedSurfaceImpact";

describe("nonContaminatedSurfaceAreaImpact", () => {
  it("returns 1000 for current and forecast impact when no contamination a 1000 square meters site", () => {
    expect(
      getNonContaminatedSurfaceAreaImpact({
        siteTotalSurfaceArea: 1000,
        decontaminatedSurface: 0,
        contaminatedSurface: 0,
      }),
    ).toEqual({
      base: 1000,
      forecast: 1000,
      difference: 0,
    });
  });

  it("returns 750 for current and 1000 for forecast impact when 250 square meters of contaminated surface are on a 1000 square meters site", () => {
    expect(
      getNonContaminatedSurfaceAreaImpact({
        siteTotalSurfaceArea: 1000,
        decontaminatedSurface: 250,
        contaminatedSurface: 250,
      }),
    ).toEqual({
      base: 750,
      forecast: 1000,
      difference: 250,
    });
  });

  it("returns 750 for current and 850 for forecast impact when 100 m² will be decontaminated", () => {
    expect(
      getNonContaminatedSurfaceAreaImpact({
        siteTotalSurfaceArea: 1000,
        decontaminatedSurface: 100,
        contaminatedSurface: 250,
      }),
    ).toEqual({
      base: 750,
      forecast: 850,
      difference: 100,
    });
  });
});
