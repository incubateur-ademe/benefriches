import { SoilType } from "@/features/create-site/domain/siteFoncier.types";

export const SOIL_TYPES = [
  SoilType.BUILDINGS,
  SoilType.IMPERMEABLE_SOILS,
  SoilType.MINERAL_SOIL,
  SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED,
  SoilType.ARTIFICIAL_TREE_FILLED,
  SoilType.FOREST_DECIDUOUS,
  SoilType.FOREST_CONIFER,
  SoilType.FOREST_POPLAR,
  SoilType.FOREST_MIXED,
  SoilType.PRAIRIE_GRASS,
  SoilType.PRAIRIE_BUSHES,
  SoilType.PRAIRIE_TREES,
  SoilType.ORCHARD,
  SoilType.CULTIVATION,
  SoilType.VINEYARD,
  SoilType.WET_LAND,
  SoilType.WATER,
];

const NON_FLAT_SOIL_TYPES = [
  SoilType.BUILDINGS,
  SoilType.FOREST_CONIFER,
  SoilType.FOREST_DECIDUOUS,
  SoilType.FOREST_MIXED,
  SoilType.FOREST_POPLAR,
  SoilType.PRAIRIE_TREES,
  SoilType.ARTIFICIAL_TREE_FILLED,
];

export const FLAT_SOIL_TYPES = SOIL_TYPES.filter(
  (soilType) => !NON_FLAT_SOIL_TYPES.includes(soilType),
);
