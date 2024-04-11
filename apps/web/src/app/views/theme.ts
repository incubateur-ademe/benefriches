export const soilColors = {
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

export const impactColors = {
  positive: "#18753C",
  neutral: "#161616",
  negative: "#CE0500",
};

export default {
  extend: {
    colors: {
      gray: "#DDDDDD",
      warning: "#B34000",
      // can be used with classes tw-soils-buildings, tw-soils-impermeable-soils...
      soils: soilColors,
    },
  },
};
