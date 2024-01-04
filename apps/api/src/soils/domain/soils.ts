export type SoilType =
  | "BUILDINGS"
  | "IMPERMEABLE_SOILS"
  | "MINERAL_SOIL"
  | "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"
  | "ARTIFICIAL_TREE_FILLED"
  | "FOREST_DECIDUOUS"
  | "FOREST_CONIFER"
  | "FOREST_POPLAR"
  | "FOREST_MIXED"
  | "PRAIRIE_GRASS"
  | "PRAIRIE_BUSHES"
  | "PRAIRIE_TREES"
  | "ORCHARD" // verge
  | "CULTIVATION" // culture
  | "VINEYARD" // vigne
  | "WET_LAND" // zone humide
  | "WATER"; // plan d'eau

const IMPERMEABLE_SOILS: readonly SoilType[] = ["BUILDINGS", "IMPERMEABLE_SOILS"];

export const isImpermeableSoil = (soilType: SoilType) => {
  return IMPERMEABLE_SOILS.includes(soilType);
};

export const isPermeableSoil = (soilType: SoilType) => {
  return !isImpermeableSoil(soilType);
};
