import { fr } from "@codegouvfr/react-dsfr";
import { ReconversionProjectSoilsDistribution, SoilType, ORDERED_SOIL_TYPES } from "shared";

const soilColors = {
  buildings: "#EB13BE",
  "impermeable-soils": "#B713EB",
  "mineral-soils": "#AAAAAA",
  "artificial-grass-or-bushes-filled": "#B8EC13",
  "artificial-tree-filled": "#59C939",
  "forest-conifer": "#35C6A3",
  "forest-deciduous": "#639E74",
  "forest-poplar": "#8B9B61",
  "forest-mixed": "#12EB46",
  "prairie-grass": "#FDCA05",
  "prairie-bushes": "#C5A235",
  "prairie-trees": "#9D7465",
  "wet-land": "#13BCEC",
  cultivation: "#FDFE10",
  orchard: "#F97F05",
  vineyard: "#F80338",
  water: "#1243EB",
};

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

export const getColorForCarbonStorageSoilType = (value: SoilType): string => {
  if (value === "WATER") {
    return fr.colors.decisions.background.default.grey.default;
  }
  return getColorForSoilType(value);
};

export const sortAndAggregateProjectSoilDistribution = (
  soilsDistribution: ReconversionProjectSoilsDistribution,
): { soilType: SoilType; surfaceArea: number }[] => {
  const groupedMap = soilsDistribution.reduce((acc, item) => {
    const current = acc.get(item.soilType) || 0;
    acc.set(item.soilType, current + item.surfaceArea);
    return acc;
  }, new Map<SoilType, number>());

  return ORDERED_SOIL_TYPES.filter((soilType) => groupedMap.has(soilType)).map((soilType) => ({
    soilType,
    surfaceArea: groupedMap.get(soilType)!,
  }));
};
