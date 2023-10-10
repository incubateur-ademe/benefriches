import {
  FricheSoilTypeOption,
  NATURAL_OR_AGRICULTURAL_SOILS,
} from "./FricheSoilsForm";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";

export const getLabelForFricheSoilType = (value: FricheSoilTypeOption) => {
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
    case NATURAL_OR_AGRICULTURAL_SOILS:
      return "Espaces naturels ou agricoles (forêt, prairie, culture...)";
  }
};
