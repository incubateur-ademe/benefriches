import { SoilsDistribution } from "shared";

import { computePermeableSurfaceAreaImpact } from "./permeableSurfaceAreaImpact";

describe("PermeableSurfaceArea impact", () => {
  it("returns no difference when no change in soils distribution", () => {
    const soilsDistribution: SoilsDistribution = {
      IMPERMEABLE_SOILS: 200,
      BUILDINGS: 25,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      PRAIRIE_GRASS: 500,
      MINERAL_SOIL: 320,
    };
    expect(
      computePermeableSurfaceAreaImpact({
        baseSoilsDistribution: soilsDistribution,
        forecastSoilsDistribution: soilsDistribution,
      }),
    ).toEqual({
      base: 920,
      forecast: 920,
      difference: 0,
      greenSoil: {
        base: 600,
        forecast: 600,
        difference: 0,
      },
      mineralSoil: {
        base: 320,
        forecast: 320,
        difference: 0,
      },
    });
  });

  it("returns impact when more mineral soils in forecast", () => {
    const baseSoilsDistribution: SoilsDistribution = {
      IMPERMEABLE_SOILS: 200,
      BUILDINGS: 25,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      PRAIRIE_GRASS: 500,
      MINERAL_SOIL: 320,
    };
    const forecastSoilsDistribution: SoilsDistribution = {
      ...baseSoilsDistribution,
      IMPERMEABLE_SOILS: 100,
      MINERAL_SOIL: 420,
    };
    expect(
      computePermeableSurfaceAreaImpact({
        baseSoilsDistribution,
        forecastSoilsDistribution,
      }),
    ).toEqual({
      base: 920,
      forecast: 1020,
      difference: 100,
      greenSoil: {
        base: 600,
        forecast: 600,
        difference: 0,
      },
      mineralSoil: {
        base: 320,
        forecast: 420,
        difference: 100,
      },
    });
  });
  it("returns impact when more green soils in forecast", () => {
    const baseSoilsDistribution: SoilsDistribution = {
      IMPERMEABLE_SOILS: 200,
      BUILDINGS: 100,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      PRAIRIE_GRASS: 500,
      MINERAL_SOIL: 320,
    };
    const forecastSoilsDistribution: SoilsDistribution = {
      ...baseSoilsDistribution,
      IMPERMEABLE_SOILS: 100,
      BUILDINGS: 0,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
    };
    expect(
      computePermeableSurfaceAreaImpact({
        baseSoilsDistribution,
        forecastSoilsDistribution,
      }),
    ).toEqual({
      base: 920,
      forecast: 1120,
      difference: 200,
      greenSoil: {
        base: 600,
        forecast: 800,
        difference: 200,
      },
      mineralSoil: {
        base: 320,
        forecast: 320,
        difference: 0,
      },
    });
  });
  it("returns impact when more green and mineral soils in forecast", () => {
    const baseSoilsDistribution: SoilsDistribution = {
      IMPERMEABLE_SOILS: 200,
      BUILDINGS: 100,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      PRAIRIE_GRASS: 500,
      MINERAL_SOIL: 320,
    };
    const forecastSoilsDistribution: SoilsDistribution = {
      ...baseSoilsDistribution,
      IMPERMEABLE_SOILS: 0,
      BUILDINGS: 0,
      MINERAL_SOIL: 420,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
    };
    expect(
      computePermeableSurfaceAreaImpact({
        baseSoilsDistribution,
        forecastSoilsDistribution,
      }),
    ).toEqual({
      base: 920,
      forecast: 1220,
      difference: 300,
      greenSoil: {
        base: 600,
        forecast: 800,
        difference: 200,
      },
      mineralSoil: {
        base: 320,
        forecast: 420,
        difference: 100,
      },
    });
  });
  it("returns negative impact when everything is impermeable in forecast", () => {
    const baseSoilsDistribution: SoilsDistribution = {
      IMPERMEABLE_SOILS: 200,
      BUILDINGS: 100,
      ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 100,
      PRAIRIE_GRASS: 500,
      MINERAL_SOIL: 320,
    };
    const forecastSoilsDistribution: SoilsDistribution = {
      IMPERMEABLE_SOILS: 1000,
      BUILDINGS: 220,
    };
    expect(
      computePermeableSurfaceAreaImpact({
        baseSoilsDistribution,
        forecastSoilsDistribution,
      }),
    ).toEqual({
      base: 920,
      forecast: 0,
      difference: -920,
      greenSoil: {
        base: 600,
        forecast: 0,
        difference: -600,
      },
      mineralSoil: {
        base: 320,
        forecast: 0,
        difference: -320,
      },
    });
  });
});
