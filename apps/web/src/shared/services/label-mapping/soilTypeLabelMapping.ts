import { SoilType } from "@/features/create-site/domain/siteFoncier.types";

export const getLabelForSoilType = (value: SoilType): string => {
  switch (value) {
    case SoilType.BUILDINGS:
      return "Bâtiments";
    case SoilType.IMPERMEABLE_SOILS:
      return "Sols imperméabilisés";
    case SoilType.MINERAL_SOIL:
      return "Sol minéral";
    case SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
      return "Sol enherbé et arbustif";
    case SoilType.ARTIFICIAL_TREE_FILLED:
      return "Sol arboré";
    case SoilType.FOREST_CONIFER:
      return "Forêt de conifères";
    case SoilType.FOREST_DECIDUOUS:
      return "Forêt de feuillus";
    case SoilType.FOREST_POPLAR:
      return "Forêt de peupliers";
    case SoilType.FOREST_MIXED:
      return "Forêt mixte";
    case SoilType.PRAIRIE_GRASS:
      return "Prairie herbacée";
    case SoilType.PRAIRIE_BUSHES:
      return "Prairie arbustive";
    case SoilType.PRAIRIE_TREES:
      return "Prairie arborée";
    case SoilType.WET_LAND:
      return "Zone humide";
    case SoilType.CULTIVATION:
      return "Culture";
    case SoilType.ORCHARD:
      return "Verger";
    case SoilType.VINEYARD:
      return "Vigne";
    case SoilType.WATER:
      return "Plan d'eau";
  }
};

export const getLongLabelForSoilType = (value: SoilType): string => {
  switch (value) {
    case SoilType.BUILDINGS:
      return "Bâtiments (anciens sites de production, de stockage...)";
    case SoilType.IMPERMEABLE_SOILS:
      return "Sols imperméabilisés (parking bitumé, voirie...)";
    case SoilType.MINERAL_SOIL:
      return "Sol minéral (parking ou voirie en gravier, dalles alvéolées...)";
    case SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
      return "Sol enherbé et arbustif (parc ou jardin en pelouse, aménagement paysager)";
    case SoilType.ARTIFICIAL_TREE_FILLED:
      return "Sol arboré (parc ou jardin avec des arbres plantés)";
    default:
      return getLabelForSoilType(value);
  }
};
