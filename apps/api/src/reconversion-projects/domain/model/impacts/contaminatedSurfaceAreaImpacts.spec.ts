import { computeContaminatedSurfaceAreaImpact } from "./contaminatedSurfaceAreaImpact";

describe("ContaminatedSurfaceArea impact", () => {
  it("returns 0 when no current contaminated surface area", () => {
    expect(computeContaminatedSurfaceAreaImpact({ currentContaminatedSurfaceArea: 0 })).toEqual({
      base: 0,
      forecast: 0,
    });
  });

  it("returns -25000 when current contaminated surface area is 25000 square meters", () => {
    expect(computeContaminatedSurfaceAreaImpact({ currentContaminatedSurfaceArea: 25000 })).toEqual(
      {
        base: 25000,
        forecast: 0,
      },
    );
  });
});
