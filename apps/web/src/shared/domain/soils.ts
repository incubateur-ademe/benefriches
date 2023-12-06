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
      return "#fe6a35";
    case SoilType.IMPERMEABLE_SOILS:
      return "#6b8abc";
    case SoilType.MINERAL_SOIL:
      return "#00e272";
    case SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
      return "#645fd5";
    case SoilType.ARTIFICIAL_TREE_FILLED:
      return "#2caffe";
    case SoilType.FOREST_CONIFER:
      return "#2ee0ca";
    case SoilType.FOREST_DECIDUOUS:
      return "#d568fb";
    case SoilType.FOREST_POPLAR:
      return "#d568fb";
    case SoilType.FOREST_MIXED:
      return "#feb56a";
    case SoilType.PRAIRIE_GRASS:
      return "#91e8e1";
    case SoilType.PRAIRIE_BUSHES:
      return "#45b8fe";
    case SoilType.PRAIRIE_TREES:
      return "#2caffe";
    case SoilType.WET_LAND:
      return "#544fc5";
    case SoilType.CULTIVATION:
      return "#fa4b42";
    case SoilType.ORCHARD:
      return "#00e272";
    case SoilType.VINEYARD:
      return "#d4f8f4";
    case SoilType.WATER:
      return "#2caffe";
  }
};
