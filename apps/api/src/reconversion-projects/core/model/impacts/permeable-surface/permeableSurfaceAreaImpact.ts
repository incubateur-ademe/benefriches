import {
  isGreenSoil,
  isMineralSoil,
  isPermeableSoil,
  PermeableSurfaceAreaImpactResult,
  SoilsDistribution,
  sumSoilsSurfaceAreasWhere,
} from "shared";

type PermeableSurfaceAreaImpactInput = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

export const computePermeableSurfaceAreaImpact = (
  input: PermeableSurfaceAreaImpactInput,
): PermeableSurfaceAreaImpactResult => {
  const basePermeableSoilsSurfaceArea = sumSoilsSurfaceAreasWhere(
    input.baseSoilsDistribution,
    isPermeableSoil,
  );
  const forecastPermeableSoilsSurfaceArea = sumSoilsSurfaceAreasWhere(
    input.forecastSoilsDistribution,
    isPermeableSoil,
  );
  const baseGreenSoilsSurfaceArea = sumSoilsSurfaceAreasWhere(
    input.baseSoilsDistribution,
    isGreenSoil,
  );
  const forecastGreenSoilsSurfaceArea = sumSoilsSurfaceAreasWhere(
    input.forecastSoilsDistribution,
    isGreenSoil,
  );
  const baseMineralSurfaceArea = sumSoilsSurfaceAreasWhere(
    input.baseSoilsDistribution,
    isMineralSoil,
  );
  const forecastMineralSurfaceArea = sumSoilsSurfaceAreasWhere(
    input.forecastSoilsDistribution,
    isMineralSoil,
  );

  return {
    base: basePermeableSoilsSurfaceArea,
    forecast: forecastPermeableSoilsSurfaceArea,
    difference: forecastPermeableSoilsSurfaceArea - basePermeableSoilsSurfaceArea,
    greenSoil: {
      base: baseGreenSoilsSurfaceArea,
      forecast: forecastGreenSoilsSurfaceArea,
      difference: forecastGreenSoilsSurfaceArea - baseGreenSoilsSurfaceArea,
    },
    mineralSoil: {
      base: baseMineralSurfaceArea,
      forecast: forecastMineralSurfaceArea,
      difference: forecastMineralSurfaceArea - baseMineralSurfaceArea,
    },
  };
};
