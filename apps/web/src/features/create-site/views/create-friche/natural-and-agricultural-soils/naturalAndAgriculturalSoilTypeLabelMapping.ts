import type { FricheNaturalAndAgriculturalSoilTypeOption } from "./NaturalAndAgriculturalSoilsForm";

import { FricheSoilType } from "@/features/create-site/domain/friche.types";

export const getLabelForNaturalAndAgriculturalSoilsType = (
  value: FricheNaturalAndAgriculturalSoilTypeOption,
) => {
  switch (value) {
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
    case FricheSoilType.UNKNOWN_NATURAL_AREA:
      return "Autre espace naturel ou agricole";
  }
};
