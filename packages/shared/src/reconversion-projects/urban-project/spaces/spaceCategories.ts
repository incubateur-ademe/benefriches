import { z } from "zod";

export const urbanProjectSpacesCategories = z.enum([
  "LIVING_AND_ACTIVITY_SPACES",
  "GREEN_SPACES",
  "PUBLIC_SPACES",
  "URBAN_FARM",
  "RENEWABLE_ENERGY_PRODUCTION_PLANT",
]);

export type UrbanSpaceCategory = z.infer<typeof urbanProjectSpacesCategories>;
