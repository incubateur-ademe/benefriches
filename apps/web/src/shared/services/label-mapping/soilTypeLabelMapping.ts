import { SoilType } from "shared";

export const getLabelForSoilType = (value: SoilType): string => {
  switch (value) {
    case "BUILDINGS":
      return "Bâtiments";
    case "IMPERMEABLE_SOILS":
      return "Sols imperméabilisés";
    case "MINERAL_SOIL":
      return "Sol perméable minéral";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "Sol enherbé et arbustif";
    case "ARTIFICIAL_TREE_FILLED":
      return "Sol arboré";
    case "FOREST_CONIFER":
      return "Forêt de conifères";
    case "FOREST_DECIDUOUS":
      return "Forêt de feuillus";
    case "FOREST_POPLAR":
      return "Forêt de peupliers";
    case "FOREST_MIXED":
      return "Forêt mixte";
    case "PRAIRIE_GRASS":
      return "Prairie herbacée";
    case "PRAIRIE_BUSHES":
      return "Prairie arbustive";
    case "PRAIRIE_TREES":
      return "Prairie arborée";
    case "WET_LAND":
      return "Zone humide";
    case "CULTIVATION":
      return "Culture";
    case "ORCHARD":
      return "Verger";
    case "VINEYARD":
      return "Vigne";
    case "WATER":
      return "Plan d'eau";
  }
};

export const getDescriptionForSoilType = (value: SoilType): string => {
  switch (value) {
    case "BUILDINGS":
      return "Sites de production, de stockage, de vente…";
    case "IMPERMEABLE_SOILS":
      return "Parking ou voirie bitumée…";
    case "MINERAL_SOIL":
      return "Parking ou voirie en gravier, sols semi-perméables…";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "Parc ou jardin en pelouse…";
    case "ARTIFICIAL_TREE_FILLED":
      return "Parc ou jardin avec des arbres plantés…";
    case "PRAIRIE_GRASS":
      return "Composée uniquement d'herbes et de fleurs";
    case "PRAIRIE_BUSHES":
      return "Composée d'herbe et de buissons";
    case "PRAIRIE_TREES":
      return "Parsemée d'arbres";
    case "CULTIVATION":
      return "Céréalières, légumières…";
    case "WET_LAND":
      return "Marais, tourbières, prairies humides, mangrove, lagune...";
    default:
      return "";
  }
};

const soilTypePictogramMap: Record<SoilType, string> = {
  CULTIVATION: "cultivation.svg",
  VINEYARD: "vineyard.svg",
  ORCHARD: "orchard.svg",
  PRAIRIE_GRASS: "prairie-grass.svg",
  PRAIRIE_BUSHES: "prairie-bushes.svg",
  PRAIRIE_TREES: "prairie-trees.svg",
  FOREST_DECIDUOUS: "forest-deciduous.svg",
  FOREST_CONIFER: "forest-conifer.svg",
  FOREST_POPLAR: "forest-poplar.svg",
  FOREST_MIXED: "forest-mixed.svg",
  WATER: "water.svg",
  WET_LAND: "wet-land.svg",
  BUILDINGS: "buildings.svg",
  IMPERMEABLE_SOILS: "impermeable.svg",
  MINERAL_SOIL: "mineral.svg",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED: "artificial-grass-or-bushes-filled.svg",
  ARTIFICIAL_TREE_FILLED: "artificial-tree-filled.svg",
} as const;

export const getPictogramForSoilType = (value: SoilType): string => {
  return soilTypePictogramMap[value];
};
