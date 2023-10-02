import { NaturalAreaSpaceType } from "@/components/pages/SiteFoncier/naturalArea";

export const getLabelForNaturalAreaSpaceType = (type: NaturalAreaSpaceType) => {
  switch (type) {
    case NaturalAreaSpaceType.CULTIVATION:
      return "Culture";
    case NaturalAreaSpaceType.FOREST:
      return "Forêt";
    case NaturalAreaSpaceType.ORCHARD:
      return "Verger";
    case NaturalAreaSpaceType.PRAIRIE:
      return "Prairie";
    case NaturalAreaSpaceType.VINEYARD:
      return "Vigne";
    case NaturalAreaSpaceType.WATER:
      return "Plan d'eau";
    case NaturalAreaSpaceType.WET_LAND:
      return "Zone humide";
  }
};
