import {
  computeNitrogenCycleMonetaryValue,
  computeSoilErosionMonetaryValue,
  computeWaterRegulationMonetaryValue,
  computeForestRelatedProductMonetaryValue,
  computeInvasiveSpeciesRegulationMonetaryValue,
  computeNatureRelatedWellnessAndLeisureMonetaryValue,
  computePollinisationMonetaryValue,
  computeWaterCycleMonetaryValue,
} from "./natureConservationYearlyMonetaryValue";

describe("Nature conservation yearly monetary values", () => {
  it("computeNatureRelatedWellnessAndLeisureMonetaryValue", () => {
    expect(
      computeNatureRelatedWellnessAndLeisureMonetaryValue({
        prairieSurfaceArea: 1000,
        forestSurfaceArea: 200,
      }),
    ).toBeCloseTo(13, 0);
    expect(computeNatureRelatedWellnessAndLeisureMonetaryValue({})).toEqual(0);
    expect(
      computeNatureRelatedWellnessAndLeisureMonetaryValue({
        prairieSurfaceArea: 1000,
        forestSurfaceArea: 200,
        wetLandSurfaceArea: 8000,
      }),
    ).toBeCloseTo(201, 0);
    expect(
      computeNatureRelatedWellnessAndLeisureMonetaryValue({
        prairieSurfaceArea: -1000,
        forestSurfaceArea: 200,
        wetLandSurfaceArea: 200,
      }),
    ).toBeCloseTo(4, 0);
  });

  it("computeForestRelatedProductMonetaryValue", () => {
    expect(computeForestRelatedProductMonetaryValue(200)).toBeCloseTo(3, 0);
    expect(computeForestRelatedProductMonetaryValue(0)).toEqual(0);
    expect(computeForestRelatedProductMonetaryValue(-550)).toBeCloseTo(-9, 0);
  });

  it("computePollinisationMonetaryValue", () => {
    expect(computePollinisationMonetaryValue(1000)).toBeCloseTo(9, 0);
    expect(computePollinisationMonetaryValue(0)).toEqual(0);
    expect(computePollinisationMonetaryValue(-500)).toBeCloseTo(-5, 0);
  });

  it("computeInvasiveSpeciesRegulationMonetaryValue", () => {
    expect(computeInvasiveSpeciesRegulationMonetaryValue(1000)).toBeCloseTo(3, 0);
    expect(computeInvasiveSpeciesRegulationMonetaryValue(0)).toEqual(0);
    expect(computeInvasiveSpeciesRegulationMonetaryValue(-250)).toBeCloseTo(-1, 0);
  });

  it("computeWaterCycleMonetaryValue", () => {
    expect(computeWaterCycleMonetaryValue(100, 200)).toBeCloseTo(19, 0);
    expect(computeWaterCycleMonetaryValue(100, 0)).toBeCloseTo(14, 0);
    expect(computeWaterCycleMonetaryValue(0, 0)).toEqual(0);
    expect(computeWaterCycleMonetaryValue(-250, 100)).toBeCloseTo(-31, 0);
  });

  it("computeNitrogenCycleMonetaryValue", () => {
    expect(
      computeNitrogenCycleMonetaryValue({ prairieSurfaceArea: 1000, wetLandSurfaceArea: 200 }),
    ).toBeCloseTo(11, 0);
    expect(computeNitrogenCycleMonetaryValue({})).toEqual(0);
    expect(
      computeNitrogenCycleMonetaryValue({ prairieSurfaceArea: 1000, wetLandSurfaceArea: -8000 }),
    ).toBeCloseTo(-152, 0);
  });

  it("computeSoilErosionMonetaryValue", () => {
    expect(computeSoilErosionMonetaryValue(250)).toBeCloseTo(6, 0);
    expect(computeSoilErosionMonetaryValue(0)).toEqual(0);
    expect(computeSoilErosionMonetaryValue(-250)).toBeCloseTo(-6, 0);
  });

  it("computeWaterRegulationMonetaryValue", () => {
    expect(
      computeWaterRegulationMonetaryValue({
        prairieSurfaceArea: 1000,
        forestSurfaceArea: 200,
        decontaminatedSurfaceArea: 250,
      }),
    ).toBeCloseTo(17, 0);
    expect(computeWaterRegulationMonetaryValue({})).toEqual(0);
    expect(
      computeWaterRegulationMonetaryValue({
        prairieSurfaceArea: 1000,
        forestSurfaceArea: 200,
        wetLandSurfaceArea: -4000,
        decontaminatedSurfaceArea: 150,
      }),
    ).toBeCloseTo(-336.54);
  });
});
