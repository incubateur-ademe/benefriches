import { SiteNature } from "shared";

export const getPictogramUrlForSiteNature = (siteNature: SiteNature): string => {
  switch (siteNature) {
    case "FRICHE":
      return "/img/pictograms/site-nature/friche.svg";
    case "AGRICULTURAL_OPERATION":
      return "/img/pictograms/site-nature/agricultural-operation.svg";
    case "NATURAL_AREA":
      return "/img/pictograms/site-nature/natural-area.svg";
  }
};
