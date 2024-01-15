export const soilColors = {
  buildings: "#EB13BE",
  "impermeable-soils": "#B713EB",
  "mineral-soils": "#AAAAAA",
  "artificial-grass-or-bushes-filled": "#8B9B61",
  "artificial-tree-filled": "#9D7465",
  "forest-conifer": "#35C6A3",
  "forest-deciduous": "#59C939",
  "forest-poplar": "#639E74",
  "forest-mixed": "#12EB46",
  "prairie-grass": "#B8EC13",
  "prairie-bushes": "#ECBB13",
  "prairie-trees": "#C5A235",
  "wet-land": "#13BCEC",
  cultivation: "#FDFE10",
  orchard: "#F80338",
  vineyard: "#F97F05",
  water: "#1243EB",
};

export default {
  extend: {
    colors: {
      // can be used with classes tw-soils-buildings, tw-soils-impermeable-soils...
      soils: soilColors,
    },
  },
};
