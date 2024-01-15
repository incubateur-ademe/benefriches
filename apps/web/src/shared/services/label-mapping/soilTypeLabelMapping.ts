import { SoilType } from "@/shared/domain/soils";

export const getLabelForSoilType = (value: SoilType): string => {
  switch (value) {
    case SoilType.BUILDINGS:
      return "Bâtiments";
    case SoilType.IMPERMEABLE_SOILS:
      return "Sols imperméabilisés";
    case SoilType.MINERAL_SOIL:
      return "Sol perméable minéral";
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

export const getDescriptionForSoilType = (value: SoilType): string => {
  switch (value) {
    case SoilType.BUILDINGS:
      return "Anciens sites de production, de stockage…";
    case SoilType.IMPERMEABLE_SOILS:
      return "Parking ou voirie bitumée…";
    case SoilType.MINERAL_SOIL:
      return "Parking ou voirie en gravier, sols semi-perméables…";
    case SoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
      return "Parc ou jardin en pelouse…";
    case SoilType.ARTIFICIAL_TREE_FILLED:
      return "Parc ou jardin avec des arbres plantés…";
    case SoilType.PRAIRIE_GRASS:
      return "Composée uniquement d’herbes et de fleurs";
    case SoilType.PRAIRIE_TREES:
      return "Composée d’herbe et de buissons";
    case SoilType.CULTIVATION:
      return "Céréalières, de légumes…";
    default:
      return "";
  }
};
