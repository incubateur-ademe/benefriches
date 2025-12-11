import type { MutabilityUsage } from "shared";

export const getUsagePictogramSrc = (usage: MutabilityUsage): string => {
  switch (usage) {
    case "residentiel":
      return "/img/pictograms/mutability-usages/residential.svg";
    case "equipements":
      return "/img/pictograms/mutability-usages/public-facilities.svg";
    case "culture":
      return "/img/pictograms/mutability-usages/culture-and-tourism.svg";
    case "tertiaire":
      return "/img/pictograms/mutability-usages/offices.svg";
    case "industrie":
      return "/img/pictograms/mutability-usages/industry.svg";
    case "renaturation":
      return "/img/pictograms/mutability-usages/renaturation.svg";
    case "photovoltaique":
      return "/img/pictograms/mutability-usages/photovoltaic.svg";
  }
};
