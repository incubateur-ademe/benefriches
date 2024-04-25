import { SoilType } from "shared";

import { soilColors } from "@/app/views/theme";

export const getColorForSoilType = (value: SoilType): string => {
  switch (value) {
    case "BUILDINGS":
      return soilColors["buildings"];
    case "IMPERMEABLE_SOILS":
      return soilColors["impermeable-soils"];
    case "MINERAL_SOIL":
      return soilColors["mineral-soils"];
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return soilColors["artificial-grass-or-bushes-filled"];
    case "ARTIFICIAL_TREE_FILLED":
      return soilColors["artificial-tree-filled"];
    case "FOREST_CONIFER":
      return soilColors["forest-conifer"];
    case "FOREST_DECIDUOUS":
      return soilColors["forest-deciduous"];
    case "FOREST_POPLAR":
      return soilColors["forest-poplar"];
    case "FOREST_MIXED":
      return soilColors["forest-mixed"];
    case "PRAIRIE_GRASS":
      return soilColors["prairie-grass"];
    case "PRAIRIE_BUSHES":
      return soilColors["prairie-bushes"];
    case "PRAIRIE_TREES":
      return soilColors["prairie-trees"];
    case "WET_LAND":
      return soilColors["wet-land"];
    case "CULTIVATION":
      return soilColors["cultivation"];
    case "ORCHARD":
      return soilColors["orchard"];
    case "VINEYARD":
      return soilColors["vineyard"];
    case "WATER":
      return soilColors["water"];
  }
};
