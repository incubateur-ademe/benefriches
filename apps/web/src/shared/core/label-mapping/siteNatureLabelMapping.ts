import type { SiteNature } from "shared";

export const getSiteNatureLabel = (nature: SiteNature): string => {
  switch (nature) {
    case "FRICHE":
      return "Friche";
    case "AGRICULTURAL_OPERATION":
      return "Exploitation agricole";
    case "NATURAL_AREA":
      return "Espace naturel";
    case "URBAN_ZONE":
      return "Zone urbaine";
  }
};
