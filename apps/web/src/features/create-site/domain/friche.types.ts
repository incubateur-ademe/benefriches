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
    case "HOSPITAL":
      return "Friche hospitalière";
    case "ADMINISTRATION":
      return "Friche administrative";
    case "BUSINESS":
      return "Friche commerciale";
    case "HOUSING":
      return "Friche d'habitat";
    case "OTHER":
      return "Friche";
  }
};
