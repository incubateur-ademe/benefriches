import {
  isGreenSoil,
  isMineralSoil,
  isPermeableSoil,
  SoilsDistribution,
  sumSoilsSurfaceAreasWhere,
} from "shared";

export type PermeableSurfaceAreaImpactResult = {
  base: number;
  forecast: number;
  mineralSoil: {
    base: number;
    forecast: number;
  };
  greenSoil: {
    base: number;
    forecast: number;
  };
};

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
    greenSoil: {
      base: baseGreenSoilsSurfaceArea,
      forecast: forecastGreenSoilsSurfaceArea,
    },
    mineralSoil: {
      base: baseMineralSurfaceArea,
      forecast: forecastMineralSurfaceArea,
    },
  };
};
