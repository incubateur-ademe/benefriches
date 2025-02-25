import z from "zod";

export const fricheActivitySchema = z.enum([
  "AGRICULTURE",
  "INDUSTRY",
  "MILITARY",
  "RAILWAY",
  "PORT",
  "TIP_OR_RECYCLING_SITE",
  "BUILDING",
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
    case "BUILDING":
      return "Ancien bâtiment";
    case "OTHER":
      return "Friche";
  }
};
