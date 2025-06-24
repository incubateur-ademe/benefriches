import {
  isGreenSoil,
  isMineralSoil,
  isPermeableSoil,
  SoilsDistribution,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import { Impact } from "../impact";

export const getPermeableSurfaceImpact = (
  baseSoilsDistribution: SoilsDistribution,
  forecastSoilsDistribution: SoilsDistribution,
) => {
  return {
    ...Impact.get({
      base: sumSoilsSurfaceAreasWhere(baseSoilsDistribution, isPermeableSoil),
      forecast: sumSoilsSurfaceAreasWhere(forecastSoilsDistribution, isPermeableSoil),
    }),
    greenSoil: Impact.get({
      base: sumSoilsSurfaceAreasWhere(baseSoilsDistribution, isGreenSoil),
      forecast: sumSoilsSurfaceAreasWhere(forecastSoilsDistribution, isGreenSoil),
    }),
    mineralSoil: Impact.get({
      base: sumSoilsSurfaceAreasWhere(baseSoilsDistribution, isMineralSoil),
      forecast: sumSoilsSurfaceAreasWhere(forecastSoilsDistribution, isMineralSoil),
    }),
  };
};
