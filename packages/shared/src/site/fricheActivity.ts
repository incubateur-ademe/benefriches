import z from "zod";

export const fricheActivitySchema = z.enum([
  "AGRICULTURE",
  "INDUSTRY",
  "MILITARY",
  "RAILWAY",
  "PORT",
  "TIP_OR_RECYCLING_SITE",
  "PUBLIC_FACILITY",
  "BUSINESS",
  "HOUSING",
  "OTHER",
]);

export type FricheActivity = z.infer<typeof fricheActivitySchema>;

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
      return "Friche";
  }
};
