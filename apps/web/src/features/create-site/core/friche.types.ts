import { FricheActivity } from "shared";

export const getFricheActivityLabel = (fricheActivity: FricheActivity): string => {
  switch (fricheActivity) {
    case "AGRICULTURE":
      return "Friche agricole";
    case "INDUSTRY":
      return "Friche industrielle";
    case "MILITARY":
      return "Friche militaire";
    case "RAILWAY":
      return "Friche ferroviaire";
    case "PORT":
      return "Friche portuaire";
    case "TIP_OR_RECYCLING_SITE":
      return "Ancienne décharge ou site de recyclage";
    case "PUBLIC_FACILITY":
      return "Ancien bâtiment public";
    case "BUSINESS":
      return "Ancienne zone commerciale";
    case "HOUSING":
      return "Ancienne zone d'habitation";
    case "OTHER":
      return "Autre";
  }
};
