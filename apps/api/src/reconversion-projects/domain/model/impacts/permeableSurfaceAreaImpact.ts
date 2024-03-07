import { typedObjectEntries } from "src/shared-kernel/typedEntries";
import {
  isGreenSoil,
  isMineralSoil,
  isPermeableSoil,
  SoilsDistribution,
  SoilType,
} from "src/soils/domain/soils";

export type PermeableSurfaceAreaImpactResult = {
  base: number;
  forecast: number;
  difference: number;
  mineralSoil: {
    base: number;
    forecast: number;
    difference: number;
  };
  greenSoil: {
    base: number;
    forecast: number;
    difference: number;
  };
};

type PermeableSurfaceAreaImpactInput = {
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
};

const sumSoilsSurfaceAreasWhere = (
  soilsDistribution: SoilsDistribution,
  cb: (s: SoilType) => boolean,
) => {
  return typedObjectEntries(soilsDistribution)
    .filter(([soilType]) => cb(soilType))
    .reduce((sum, [, area]) => sum + (area ?? 0), 0);
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
