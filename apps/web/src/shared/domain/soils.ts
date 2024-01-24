import { soilColors } from "@/app/views/theme";

export enum SoilType {
  BUILDINGS = "BUILDINGS",
  IMPERMEABLE_SOILS = "IMPERMEABLE_SOILS",
  MINERAL_SOIL = "MINERAL_SOIL",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED = "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
  ARTIFICIAL_TREE_FILLED = "ARTIFICIAL_TREE_FILLED",
  FOREST_DECIDUOUS = "FOREST_DECIDUOUS",
  FOREST_CONIFER = "FOREST_CONIFER",
  FOREST_POPLAR = "FOREST_POPLAR",
  FOREST_MIXED = "FOREST_MIXED",
  PRAIRIE_GRASS = "PRAIRIE_GRASS",
  PRAIRIE_BUSHES = "PRAIRIE_BUSHES",
  PRAIRIE_TREES = "PRAIRIE_TREES",
  ORCHARD = "ORCHARD", // verger
  CULTIVATION = "CULTIVATION", // culture
  VINEYARD = "VINEYARD", // vigne
  WET_LAND = "WET_LAND", // zone humide
  WATER = "WATER", // plan d'eau
}

export const getColorForSoilType = (value: SoilType): string => {
  switch (value) {
    case SoilType.BUILDINGS:
      return soilColors["buildings"];
    case SoilType.IMPERMEABLE_SOILS:
      return soilColors["impermeable-soils"];
    case SoilType.MINERAL_SOIL:
      return soilColors["mineral-soils"];
    case SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
      return soilColors["artificial-grass-or-bushes-filled"];
    case SoilType.ARTIFICIAL_TREE_FILLED:
      return soilColors["artificial-tree-filled"];
    case SoilType.FOREST_CONIFER:
      return soilColors["forest-conifer"];
    case SoilType.FOREST_DECIDUOUS:
      return soilColors["forest-deciduous"];
    case SoilType.FOREST_POPLAR:
      return soilColors["forest-poplar"];
    case SoilType.FOREST_MIXED:
      return soilColors["forest-mixed"];
    case SoilType.PRAIRIE_GRASS:
      return soilColors["prairie-grass"];
    case SoilType.PRAIRIE_BUSHES:
      return soilColors["prairie-bushes"];
    case SoilType.PRAIRIE_TREES:
      return soilColors["prairie-trees"];
    case SoilType.WET_LAND:
      return soilColors["wet-land"];
    case SoilType.CULTIVATION:
      return soilColors["cultivation"];
    case SoilType.ORCHARD:
      return soilColors["orchard"];
    case SoilType.VINEYARD:
      return soilColors["vineyard"];
    case SoilType.WATER:
      return soilColors["water"];
  }
};
