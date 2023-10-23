import { FricheSoilType } from "@/features/create-site/domain/friche.types";

export const getLabelForFricheSoilType = (value: FricheSoilType): string => {
  switch (value) {
    case FricheSoilType.BUILDINGS:
      return "Bâtiments (anciens sites de production, de stockage...)";
    case FricheSoilType.IMPERMEABLE_SOILS:
      return "Sols imperméabilisés (parking bitumé, voirie...)";
    case FricheSoilType.MINERAL_SOIL:
      return "Sol minéral (parking ou voirie en gravier, dalles alvéolées...)";
    case FricheSoilType.ARTIFICIAL_GRASS_OR_BUSHES_FILLED:
      return "Sol enherbé et arbustif (parc ou jardin en pelouse, aménagement paysager)";
    case FricheSoilType.ARTIFICIAL_TREE_FILLED:
      return "Sol arboré (parc ou jardin avec des arbres plantés)";
    case FricheSoilType.FOREST_CONIFER:
      return "Forêt de conifères";
    case FricheSoilType.FOREST_DECIDUOUS:
      return "Forêt de feuillus";
    case FricheSoilType.FOREST_POPLAR:
      return "Forêt de peupliers";
    case FricheSoilType.FOREST_MIXED:
      return "Forêt mixte";
    case FricheSoilType.PRAIRIE_GRASS:
      return "Prairie herbacée";
    case FricheSoilType.PRAIRIE_BUSHES:
      return "Prairie arbustive";
    case FricheSoilType.PRAIRIE_TREES:
      return "Prairie arborée";
    case FricheSoilType.WET_LAND:
      return "Zone humide";
    case FricheSoilType.CULTIVATION:
      return "Culture";
    case FricheSoilType.ORCHARD:
      return "Verger";
    case FricheSoilType.VINEYARD:
      return "Vigne";
    case FricheSoilType.WATER:
      return "Plan d'eau";
  }
};
