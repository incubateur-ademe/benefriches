import { SiteNature, SoilType } from "shared";

export const getLabelForSoilType = (value: SoilType): string => {
  switch (value) {
    case "BUILDINGS":
      return "Bâtiments";
    case "IMPERMEABLE_SOILS":
      return "Sols imperméabilisés";
    case "MINERAL_SOIL":
      return "Sols perméables minéraux";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "Sols enherbés et arbustifs";
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
      return "Bâtiments à usage industriel, commercial, d'habitation...";
    case "IMPERMEABLE_SOILS":
      return "Parking ou voirie bitumée, dalle en béton…";
    case "MINERAL_SOIL":
      return "Parking ou voirie en gravier, sol semi-perméable, sol nu...";
    case "ARTIFICIAL_GRASS_OR_BUSHES_FILLED":
      return "Pelouse, haies ou arbustes plantés";
    case "ARTIFICIAL_TREE_FILLED":
      return "Arbres plantés";
    case "PRAIRIE_GRASS":
      return "Herbes et fleurs";
    case "PRAIRIE_BUSHES":
      return "Herbe et arbustes";
    case "PRAIRIE_TREES":
      return "Herbe et arbres";
    case "CULTIVATION":
      return "Céréalières, légumières…";
    case "WATER":
      return "Mare, étang, gravière...";
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
  return `/img/pictograms/soil-types/${soilTypePictogramMap[value]}`;
};

export const BASE_SPACE_SOIL_TYPE_LABEL_MAPPING = {
  BUILDINGS: "Bâtiments",
  IMPERMEABLE_SOILS: "Voies d'accès ou parking bitumé",
  MINERAL_SOIL: "Voie d'accès ou parking en gravier, sol nu",
  ARTIFICIAL_GRASS_OR_BUSHES_FILLED: "Pelouse et buissons",
  ARTIFICIAL_TREE_FILLED: "Espace arboré",
  PRAIRIE_GRASS: "Prairie herbacée",
  PRAIRIE_BUSHES: "Prairie arbustive",
  PRAIRIE_TREES: "Prairie arborée",
  WET_LAND: "Zone humide",
  CULTIVATION: "Culture",
  ORCHARD: "Verger",
  VINEYARD: "Vigne",
  WATER: "Plan d'eau",
  FOREST_CONIFER: "Forêt de conifères",
  FOREST_DECIDUOUS: "Forêt de feuillus",
  FOREST_POPLAR: "Forêt de peupliers",
  FOREST_MIXED: "Forêt mixte",
} as const satisfies Record<SoilType, string>;

const FRICHE_SPACE_SOIL_TYPE_LABEL_MAPPING = {
  ...BASE_SPACE_SOIL_TYPE_LABEL_MAPPING,
  IMPERMEABLE_SOILS: "Aire bitumée, bétonnée ou pavée",
  MINERAL_SOIL: "Aire en gravier, semi-perméable ou sol nu",
} as const satisfies Record<SoilType, string>;

export const getSpaceLabelForSoilTypeAndSiteNature = (
  soil: SoilType,
  siteNature: SiteNature,
): string => {
  switch (siteNature) {
    case "FRICHE":
      return FRICHE_SPACE_SOIL_TYPE_LABEL_MAPPING[soil];
    default:
      return BASE_SPACE_SOIL_TYPE_LABEL_MAPPING[soil];
  }
};

const BASE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING = {
  PRAIRIE_GRASS: "Composée d'herbe",
  PRAIRIE_BUSHES: "Composée d'herbe et d'arbustes",
  PRAIRIE_TREES: "Composée d'herbe, d'arbustes et d'arbres",
  CULTIVATION: "Céréalière ou légumière",
} as const satisfies Partial<Record<SoilType, string>>;

const FRICHE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING = {
  ...BASE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING,
  BUILDINGS: "À usage industriel, commercial, d'habitation...",
} as const satisfies Partial<Record<SoilType, string>>;

export const getSpaceDescriptionForSoilTypeAndSiteNature = (
  soil: SoilType,
  siteNature: SiteNature,
): string | undefined => {
  switch (siteNature) {
    case "FRICHE":
      return FRICHE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING[
        soil as keyof typeof FRICHE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING
      ];
    default:
      return BASE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING[
        soil as keyof typeof BASE_SPACE_SOIL_TYPE_DESCRIPTION_MAPPING
      ];
  }
};
