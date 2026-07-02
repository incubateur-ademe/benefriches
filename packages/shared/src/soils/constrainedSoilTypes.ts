import { SoilType } from "./soilType";

/**
 * Soil types that can only be part of a reconversion project if they already exist on the site.
 * These cannot be "created" by development - they can only be preserved.
 *
 * Constrained soils include: forests, prairies, agricultural lands, wetlands, and water.
 * Non-constrained soils (BUILDINGS, IMPERMEABLE_SOILS, MINERAL_SOIL, ARTIFICIAL_*) can be created.
 */
export const CONSTRAINED_SOIL_TYPES: ReadonlySet<SoilType> = new Set([
  "PRAIRIE_GRASS",
  "PRAIRIE_BUSHES",
  "PRAIRIE_TREES",
  "FOREST_DECIDUOUS",
  "FOREST_CONIFER",
  "FOREST_POPLAR",
  "FOREST_MIXED",
  "CULTIVATION",
  "VINEYARD",
  "ORCHARD",
  "WET_LAND",
  "WATER",
]);

export const isConstrainedSoilType = (soilType: SoilType): boolean => {
  return CONSTRAINED_SOIL_TYPES.has(soilType);
};
