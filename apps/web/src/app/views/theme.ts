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

export default {
  extend: {
    colors: {
      dsfr: {
        red: "var(--text-label-red-marianne)",
        openBlue: "var(--background-open-blue-france)",
        titleBlue: "var(--text-title-blue-france)",
        borderBlue: "var(--border-plain-blue-france)",
        grey: "var(--background-default-grey)",
        contrastGrey: "var(--background-contrast-grey)",
        greyDisabled: "var(--text-disabled-grey)",
      },
      blue: {
        light: "#D1EEFA",
        main: "#137FEB",
        dark: "#116E92",
      },
      green: {
        main: "#32762E",
      },
      borderGrey: "#DDDDDD",
      grey: {
        main: "#B2B2B2",
        light: "#F6F6F6",
        dark: "#333",
      },
      warning: "#B34000",
      impacts: {
        main: "#EEEEEE",
        dark: "#E5E5E5",
        positive: {
          main: "#18753C",
          light: "#B8FEC9",
        },
        neutral: {
          main: "#161616",
          light: "#F6F6F6",
        },
        negative: {
          main: "#CE0500",
          light: "#FFE9E9",
        },
      },
      // can be used with classes tw-soils-buildings, tw-soils-impermeable-soils...
      soils: soilColors,
    },
  },
};
